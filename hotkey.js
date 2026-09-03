import { TCPHelper, InstanceBase, Regex, InstanceStatus } from '@companion-module/base'
import { GetPresetsList } from './presets.js'
import { GetActions } from './actions.js'
import { GetFeedbacks } from './feedbacks.js'
import {
	DEFAULT_INTERVAL,
	clampInterval,
	emptyVariableValues,
	parseProcessList,
	variableDefinitions,
	variableValues,
} from './processWatch.js'
import crypto from 'node:crypto'

export { UpgradeScripts } from './upgrades.js'
const kaInterval = 30000
const MIN_LISTENER_VERSION = '9.11.0'
/** The Listener release that added the processState subscription. */
const MIN_PROCESS_WATCH_VERSION = '10.1.0'

function md5(str) {
	return crypto.createHash('md5').update(str).digest('hex')
}

function normalizeVersionString(version) {
	return String(version || '')
		.trim()
		.replace(/^v/i, '')
}

function compareVersions(left, right) {
	const leftParts = normalizeVersionString(left)
		.split('.')
		.map((value) => parseInt(value, 10) || 0)
	const rightParts = normalizeVersionString(right)
		.split('.')
		.map((value) => parseInt(value, 10) || 0)
	const length = Math.max(leftParts.length, rightParts.length)

	for (let index = 0; index < length; index++) {
		const leftValue = leftParts[index] || 0
		const rightValue = rightParts[index] || 0

		if (leftValue > rightValue) return 1
		if (leftValue < rightValue) return -1
	}

	return 0
}

/**
 * VICREO Hotkey Companion Module
 * Connects to VICREO Listener software to send keyboard commands
 */
export default class instance extends InstanceBase {
	/**
	 * Create an instance of the module
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @param {string} id - the instance ID
	 * @param {Object} config - saved user configuration parameters
	 * @since 1.0.0
	 */
	constructor(internal) {
		super(internal)
		this.intervalConnect = false

		// Create socket
		this.timeout = 5000
		this.retrying = false
		this.receiveBuffer = ''
		this.listenerVersionWarningShown = false

		// Watchdog state. `watchedProcesses` is the list the Listener has been
		// asked for; it has to survive a reconnect because the Listener drops
		// every subscription when the connection closes.
		this.processStates = new Map()
		this.watchedProcesses = []
		this.watchInterval = DEFAULT_INTERVAL
		this.watchSendAlways = false
		this.listenerVersion = ''
	}

	async init(config, _isFirstInit, secrets) {
		this.config = config
		this.secrets = secrets ?? {}
		this.updateStatus(InstanceStatus.Ok, 'Initializing...')

		this.adoptConfiguredWatchList()
		this.init_TCP()
		this.actions()
		this.initFeedbacks()
		this.initPresets()
		this.initVariables()
	}

	async configUpdated(config, secrets) {
		this.config = config
		this.secrets = secrets ?? {}
		if (this.tcp !== undefined) {
			this.tcp.destroy()
		}
		this.adoptConfiguredWatchList()
		this.init_TCP()
		this.actions()
		this.initFeedbacks()
		this.initPresets()
		this.initVariables()
	}

	/**
	 * Take the standing watch list from the connection config.
	 *
	 * Config is the default rather than the only source: the Subscribe action
	 * can replace the list at runtime, and that replacement then survives
	 * reconnects for the rest of the session.
	 */
	adoptConfiguredWatchList() {
		this.watchedProcesses = parseProcessList(this.config.watchProcesses)
		this.watchInterval = clampInterval(this.config.watchInterval)
		this.watchSendAlways = false
	}

	stopKATimer() {
		if (this.kaTimer) {
			clearTimeout(this.kaTimer)
			delete this.kaTimer
		}
	}

	startKATimer() {
		this.stopKATimer()
		this.kaTimer = setTimeout(() => {
			this.sendCommand({ type: 'keepAlive' })
		}, kaInterval)
	}

	sendCommand(command) {
		// The password lives in the secrets store (a `secret-text` field), so it
		// stays out of exported configs. Older configs are moved there by the
		// upgrade script in upgrades.js.
		command.password = md5(this.secrets?.password ?? '')
		if (command !== undefined) {
			if (this.tcp !== undefined) {
				if (command.type !== 'keepAlive') this.log('debug', `${JSON.stringify(command)} to ${this.config.host}`)
				try {
					// TCPHelper throws on a destroyed socket, so pressing a button
					// while the Listener is unreachable would otherwise take the
					// whole module down instead of just failing the one command.
					this.tcp.send(JSON.stringify(command) + '\n')
					this.startKATimer()
				} catch (error) {
					this.log('warn', `Could not send ${command.type}: ${error.message}`)
				}
			}
		}
	}

	/**
	 * Process incoming data
	 * @param {JSON obj} data
	 */
	processData(msg) {
		// A command the Listener refused. Since Listener 10.4 a command that is
		// switched off under Settings → Allowed remote actions is answered on the
		// socket as {status:'error', type:<the command>, code:'ACTION_DISABLED',
		// msg}. Handled before the switch, because `type` is the command's type
		// and would otherwise land in the "unknown type" branch below. Process
		// watchdog errors keep their own handling.
		if (msg.status === 'error' && msg.type !== 'processState') {
			this.handleRefusal(msg)
			return
		}
		switch (msg.type) {
			case 'version':
				this.listenerVersion = msg.data
				this.setVariableValues({ version: msg.data })
				this.checkListenerCompatibility(msg.data)
				break
			case 'license':
				this.setVariableValues({ license: msg.data })
				break
			case 'mousePosition':
				this.setVariableValues({ mouseX: msg.x, mouseY: msg.y })
				break
			case 'processState':
				this.handleProcessState(msg)
				break
			case 'subscribe':
			case 'unsubscribe':
			case 'getMousePosition':
			case 'keepAlive':
				break

			default:
				this.log('debug', 'Unknown message type:', msg.type)
				break
		}
	}

	/**
	 * The Listener answered a command with an error. `code` is the stable part
	 * of that answer (the message text is not), so branch on it. The Listener's
	 * own message already says where to switch the action back on, and the
	 * person reading this log is usually the person who can.
	 */
	handleRefusal(msg) {
		const command = msg.type ? `"${msg.type}"` : 'a command'
		const reason = msg.msg ?? (msg.code === 'ACTION_DISABLED' ? 'that action is switched off' : 'no reason given')
		this.log('warn', `Listener on ${this.config.host} refused ${command}: ${reason}`)
	}

	/**
	 * A watchdog report for one process.
	 *
	 * The Listener only sends these when the state changes (unless the
	 * subscription asked for a heartbeat), so every message is worth acting on.
	 */
	handleProcessState(msg) {
		if (msg.status === 'error') {
			this.log('warn', `Process watchdog: ${msg.msg} (${msg.process})`)
			return
		}
		if (!msg.process) return

		const previous = this.processStates.get(msg.process)
		this.processStates.set(msg.process, {
			running: !!msg.running,
			frontmost: !!msg.frontmost,
			// Kept as a tri-state: null means the Listener could not establish it.
			responsive: msg.responsive === undefined ? null : msg.responsive,
			pid: msg.pid,
		})

		if (previous && previous.running && !msg.running) {
			this.log('warn', `Process watchdog: "${msg.process}" is no longer running`)
		} else if (previous && previous.responsive !== false && msg.responsive === false) {
			this.log('warn', `Process watchdog: "${msg.process}" is not responding`)
		}

		this.setVariableValues(variableValues(msg))
		this.checkFeedbacks('processState')
	}

	/**
	 * Forget everything the watchdog reported.
	 *
	 * Called when the connection drops: the reports stop, so the last values are
	 * stale, and leaving them in place would keep a button showing "running" for
	 * an application nobody can see any more. The watch list itself is kept, so
	 * the reconnect can re-establish it.
	 */
	clearProcessStates() {
		if (this.processStates.size === 0) return
		this.processStates.clear()
		for (const processName of this.watchedProcesses) {
			this.setVariableValues(emptyVariableValues(processName))
		}
		this.checkFeedbacks('processState')
	}

	/** Current watchdog state for a process, or undefined if nothing is known. */
	getProcessState(processName) {
		const wanted = String(processName ?? '').trim()
		if (wanted === '') return undefined
		if (this.processStates.has(wanted)) return this.processStates.get(wanted)

		// Be forgiving about case in the feedback option: the Listener matches
		// process names case-insensitively, so the button should too.
		const lowered = wanted.toLowerCase()
		for (const [name, state] of this.processStates) {
			if (name.toLowerCase() === lowered) return state
		}
		return undefined
	}

	/**
	 * Start (or replace) the process subscription.
	 * @param {string} processes comma separated, as typed by the user
	 * @param {unknown} interval milliseconds
	 * @param {boolean} sendAlways report every interval instead of on change
	 */
	subscribeProcesses(processes, interval, sendAlways) {
		const list = parseProcessList(processes)
		if (list.length === 0) {
			this.log('warn', 'Process watchdog: no processes given, nothing to subscribe to')
			return
		}

		this.watchedProcesses = list
		this.watchInterval = clampInterval(interval)
		this.watchSendAlways = !!sendAlways
		this.initVariables()
		this.sendProcessSubscription()
	}

	/** Stop the process subscription and blank the state it produced. */
	unsubscribeProcesses() {
		const stopped = this.watchedProcesses
		this.watchedProcesses = []
		this.sendCommand({ type: 'unsubscribe', name: 'processState' })

		// Leaving the last known values in place would keep a dead button green.
		this.processStates.clear()
		for (const processName of stopped) {
			this.setVariableValues(emptyVariableValues(processName))
		}
		this.initVariables()
		this.checkFeedbacks('processState')
	}

	/** Send the current watch list to the Listener. */
	sendProcessSubscription() {
		if (this.watchedProcesses.length === 0) return

		if (this.listenerVersion && compareVersions(this.listenerVersion, MIN_PROCESS_WATCH_VERSION) < 0) {
			this.log(
				'warn',
				`Process watchdog needs VICREO-Listener ${MIN_PROCESS_WATCH_VERSION} or newer, this one reports ${this.listenerVersion}.`,
			)
		}

		this.sendCommand({
			type: 'subscribe',
			name: 'processState',
			processes: this.watchedProcesses,
			interval: this.watchInterval,
			sendAlways: this.watchSendAlways,
		})
		this.log('debug', `Process watchdog: watching ${this.watchedProcesses.join(', ')} every ${this.watchInterval}ms`)
	}

	checkListenerCompatibility(version) {
		const normalizedVersion = normalizeVersionString(version)
		if (!normalizedVersion) {
			return
		}

		if (compareVersions(normalizedVersion, MIN_LISTENER_VERSION) < 0) {
			if (!this.listenerVersionWarningShown) {
				this.listenerVersionWarningShown = true
				this.log(
					'warn',
					`Connected VICREO-Listener ${normalizedVersion} is older than ${MIN_LISTENER_VERSION}. Please update VICREO-Listener for the latest vicreo-hotkey protocol support.`,
				)
			}
			return
		}

		this.listenerVersionWarningShown = false
	}

	// Functions to handle socket events
	makeConnection() {
		// Create socket and bind callbacks
		if (this.config.bonjour_host) {
			let index = this.config.bonjour_host.indexOf(':')
			if (index >= 0) {
				this.log(
					'info',
					`Connecting via bonjour ${this.config.bonjour_host.substring(0, index)}:${this.config.bonjour_host.substring(
						index + 1,
					)}`,
				)
				this.tcp = new TCPHelper(
					this.config.bonjour_host.substring(0, index),
					Number(this.config.bonjour_host.substring(index + 1)),
				)
			} else {
				this.log('error', `Invalid bonjour host: ${this.config.bonjour_host}`)
			}
		} else {
			this.log('info', `Connecting to ${this.config.host}:${this.config.port}...`)
			this.tcp = new TCPHelper(this.config.host, Number(this.config.port))
		}

		this.tcp.on('status_change', (status, message) => {
			this.updateStatus(status, message)
		})
		this.tcp.on('connect', () => {
			this.log('info', 'connected')
			clearInterval(this.intervalConnect)
			this.retrying = false
			this.receiveBuffer = ''
			this.listenerVersionWarningShown = false
			this.startKATimer()
			// The Listener tears down every subscription when the socket closes,
			// so a reconnect has to re-establish the watch or it silently stops.
			this.sendProcessSubscription()
		})
		this.tcp.on('data', (data) => {
			this.receiveBuffer += data.toString()
			let dataArray = this.receiveBuffer.split(/\r?\n/)
			this.receiveBuffer = dataArray.pop() || ''
			for (const rawData of dataArray) {
				if (!rawData.trim()) continue
				try {
					const processed = JSON.parse(rawData)
					if (processed !== null && typeof processed === 'object') this.processData(processed)
				} catch (objError) {
					if (objError instanceof SyntaxError) {
						console.error(objError.name)
					} else {
						console.error(objError.message)
					}
				}
			}
		})

		// TCPHelper emits 'end' and 'error' on a lost connection, never 'close',
		// and it reconnects internally (re-emitting 'connect', which is what
		// re-establishes the subscription).
		this.tcp.on('end', () => {
			this.clearProcessStates()
		})

		this.tcp.on('close', () => {
			this.log('info', 'Connection closed')
			if (!this.retrying) {
				this.retrying = true
				this.log('info', 'Reconnecting...')
			}
			this.intervalConnect = setInterval(() => this.makeConnection(), this.timeout)
			this.stopKATimer()
		})
		this.tcp.on('error', (err) => {
			this.log('info', err.toString())
			this.clearProcessStates()
		})
	}

	init_TCP() {
		this.updateStatus(InstanceStatus.Connecting)

		if (this.config.port == undefined || this.config.port === '') this.config.port = 10001
		this.makeConnection()
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value:
					'This module is for the VICREO Hotkey Listener, download <a href="https://www.vicreo-listener.com/" target="_new">here</a>.',
			},
			{
				type: 'bonjour-device',
				id: 'bonjour_host',
				label: 'Find on the network',
				width: 6,
			},
			{
				type: 'textinput',
				useVariables: false,
				id: 'host',
				label: 'Target IP',
				isVisibleExpression: `!$(options:bonjour_host)`,
				width: 6,
				regex: Regex.IP,
			},
			{
				type: 'static-text',
				id: 'host-filler',
				width: 6,
				label: '',
				isVisibleExpression: `!!$(options:bonjour_host)`,
				value: '',
			},
			{
				type: 'textinput',
				useVariables: false,
				id: 'port',
				label: 'Port number',
				width: 6,
				isVisibleExpression: `!$(options:bonjour_host)`,
				regex: Regex.PORT,
				default: '10001',
			},
			{
				type: 'secret-text',
				id: 'password',
				label: 'Password protected listeners',
				width: 6,
				default: '',
			},
			{
				type: 'static-text',
				id: 'watch-info',
				width: 12,
				label: 'Process watchdog (pro)',
				value:
					'Watch applications on the target machine and expose them as variables and the "Process state" feedback. Listed here they are watched automatically, including after a reconnect.',
			},
			{
				type: 'textinput',
				useVariables: false,
				id: 'watchProcesses',
				label: 'Watch these processes (comma separated)',
				width: 8,
				default: '',
				tooltip:
					'e.g. "chrome.exe, POWERPNT.EXE" on Windows or "Keynote, Google Chrome" on macOS. Leave empty to disable.',
			},
			{
				type: 'number',
				id: 'watchInterval',
				label: 'Check interval (ms)',
				width: 4,
				default: 10000,
				min: 1000,
				max: 600000,
			},
		]
	}

	// When module gets deleted
	async destroy() {
		this.log('info', 'destroy')
		this.stopKATimer()
		if (this.tcp !== undefined) {
			this.tcp.destroy()
		}
	}

	initVariables() {
		this.setVariableDefinitions({
			version: { name: 'VICREO Listener version' },
			license: { name: 'License' },
			mouseX: { name: 'mouseX' },
			mouseY: { name: 'mouseY' },
			// Four per watched process, so these come and go with the watch list.
			...variableDefinitions(this.watchedProcesses),
		})
	}

	initPresets() {
		const { structure, presets } = GetPresetsList()
		this.setPresetDefinitions(structure, presets)
	}

	initFeedbacks() {
		this.setFeedbackDefinitions(GetFeedbacks(this))
	}

	actions() {
		this.setActionDefinitions(GetActions(this))
	}
}
