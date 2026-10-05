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
/** The Listener release that added `lockScreen` and the screenLock subscription. */
const MIN_SCREEN_LOCK_VERSION = '11.1.0'
/** Matches the Listener: it clamps anything faster than this. */
const MIN_SCREEN_LOCK_INTERVAL = 250
const DEFAULT_SCREEN_LOCK_INTERVAL = 1000

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

		// Screen lock watch, same reconnect reasoning as the process watch.
		// `screenLocked` is undefined while nothing is known, and null when the
		// Listener reported that it could not establish the state.
		this.screenLockWatch = null
		this.screenLocked = undefined
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
		// Configs saved before the checkbox existed have no value here; the
		// double negation keeps that as "only on change", as it always was.
		this.watchSendAlways = !!this.config.watchSendAlways
		this.screenLockWatch = this.config.watchScreenLock
			? { interval: DEFAULT_SCREEN_LOCK_INTERVAL, sendAlways: false }
			: null
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
			case 'screenLock':
				this.handleScreenLock(msg)
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

	/**
	 * A screen lock report. Sent once at subscribe time and then only on a
	 * change, unless the subscription asked for a heartbeat.
	 */
	handleScreenLock(msg) {
		const locked = msg.locked === true || msg.locked === false ? msg.locked : null
		if (this.screenLocked !== undefined && this.screenLocked !== locked) {
			this.log(
				'info',
				`Screen on ${this.config.host} is ${locked === null ? 'in an unknown state' : locked ? 'locked' : 'unlocked'}`,
			)
		}
		this.screenLocked = locked
		this.setVariableValues({ screen_locked: locked === null ? 'unknown' : String(locked) })
		this.checkFeedbacks('screenLocked')
	}

	/** Current screen lock state: true, false, null (unknown) or undefined (no data). */
	getScreenLocked() {
		return this.screenLocked
	}

	/** Forget the last report; it is stale once the connection drops. */
	clearScreenLockState() {
		if (this.screenLocked === undefined) return
		this.screenLocked = undefined
		this.setVariableValues({ screen_locked: '' })
		this.checkFeedbacks('screenLocked')
	}

	/**
	 * Start (or replace) the screen lock subscription.
	 * @param {unknown} interval milliseconds
	 * @param {boolean} sendAlways report every interval instead of on change
	 */
	subscribeScreenLock(interval, sendAlways) {
		const parsed = parseInt(interval, 10)
		this.screenLockWatch = {
			interval: Number.isFinite(parsed) ? Math.max(parsed, MIN_SCREEN_LOCK_INTERVAL) : DEFAULT_SCREEN_LOCK_INTERVAL,
			sendAlways: !!sendAlways,
		}
		this.sendScreenLockSubscription()
	}

	unsubscribeScreenLock() {
		this.screenLockWatch = null
		this.sendCommand({ type: 'unsubscribe', name: 'screenLock' })
		this.clearScreenLockState()
	}

	sendScreenLockSubscription() {
		if (!this.screenLockWatch) return
		this.warnIfOlderThan(MIN_SCREEN_LOCK_VERSION, 'Screen lock state')
		this.sendCommand({
			type: 'subscribe',
			name: 'screenLock',
			interval: this.screenLockWatch.interval,
			sendAlways: this.screenLockWatch.sendAlways,
		})
	}

	lockScreen() {
		this.warnIfOlderThan(MIN_SCREEN_LOCK_VERSION, 'Lock screen')
		this.sendCommand({ type: 'lockScreen' })
	}

	/**
	 * An older Listener answers an unknown command only in its own log, so say
	 * here why the button did nothing.
	 */
	warnIfOlderThan(minimum, feature) {
		if (this.listenerVersion && compareVersions(this.listenerVersion, minimum) < 0) {
			this.log(
				'warn',
				`${feature} needs VICREO-Listener ${minimum} or newer, this one reports ${this.listenerVersion}.`,
			)
		}
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
			this.sendScreenLockSubscription()
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
			this.clearScreenLockState()
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
			this.clearScreenLockState()
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
			{
				type: 'checkbox',
				id: 'watchSendAlways',
				label: 'Report every interval (not just on change)',
				width: 12,
				default: false,
				tooltip:
					'Off: the Listener only reports a process when its state changes, which keeps the network quiet. On: a report on every check, so a missed change is corrected at the next interval. Use this for critical monitoring.',
			},
			{
				type: 'checkbox',
				id: 'watchScreenLock',
				label: 'Watch whether the screen is locked (pro, Listener 11.1+)',
				width: 12,
				default: false,
				tooltip:
					'Fills the $(vicreo-hotkey:screen_locked) variable and the "Screen locked" feedback, including after a reconnect.',
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
			screen_locked: { name: 'Screen locked (true / false / unknown)' },
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
