const { TCPHelper, InstanceBase, runEntrypoint, Regex, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const { GetPresetsList } = require('./presets')
const { GetActions } = require('./actions')
const crypto = require('crypto')
const kaInterval = 30000

function md5(str) {
	return crypto.createHash('md5').update(str).digest('hex')
}

class instance extends InstanceBase {
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
	}

	async init(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Ok, 'Initializing...')

		this.init_TCP()
		this.actions()
		this.initPresets()
		this.initVariables()
	}

	async configUpdated(config) {
		this.config = config
		if (this.tcp !== undefined) {
			this.tcp.destroy()
		}
		this.init_TCP()
		this.actions()
		this.initPresets()
		this.initVariables()
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
		command.password = md5(this.config.password)
		// console.log('command', JSON.stringify(command))
		if (command !== undefined) {
			if (this.tcp !== undefined) {
				if (command.type !== 'keepAlive') this.log('debug', `${JSON.stringify(command)} to ${this.config.host}`)
				this.tcp.send(JSON.stringify(command))
				this.startKATimer()
			}
		}
		Object.keys(command).forEach((key) => {
			delete command[key]
		})
	}

	/**
	 * Process incoming data
	 * @param {JSON obj} data
	 */
	processData(msg) {
		switch (msg.type) {
			case 'version':
				this.setVariableValues({ version: msg.data })
				break
			case 'license':
				this.setVariableValues({ license: msg.data })
				break
			case 'mousePosition':
				this.setVariableValues({ mouseX: msg.x, mouseY: msg.y })
				break
			case 'subscribe':
			case 'unsubscribe':
			case 'getMousePosition':
			case 'keepAlive':
				break

			default:
				console.log('Other message', msg)
				break
		}
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
						index + 1
					)}`
				)
				this.tcp = new TCPHelper(
					this.config.bonjour_host.substring(0, index),
					this.config.bonjour_host.substring(index + 1)
				)
			} else {
				this.log('error', `Invalid bonjour host: ${this.config.bonjour_host}`)
			}
		} else {
			this.log('info', `Connecting to ${this.config.host}:${this.config.port}...`)
			this.tcp = new TCPHelper(this.config.host, this.config.port)
		}

		this.tcp.on('status_change', (status, message) => {
			this.updateStatus(status, message)
		})
		this.tcp.on('connect', () => {
			this.log('info', 'connected')
			console.log('connected')
			clearInterval(this.intervalConnect)
			this.retrying = false
			this.startKATimer()
		})
		this.tcp.on('data', (data) => {
			let dataArray = data.toString().trim().split('\r\n')
			for (const rawData of dataArray) {
				try {
					let processed = JSON.parse(rawData)
					if (processed !== null || processed !== undefined) this.processData(processed)
				} catch (objError) {
					if (objError instanceof SyntaxError) {
						console.error(objError.name)
					} else {
						console.error(objError.message)
					}
				}
			}
		})

		this.tcp.on('close', () => {
			this.log('info', 'Connection closed')
			if (!this.retrying) {
				this.retrying = true
				console.log('Reconnecting...')
			}
			this.intervalConnect = setInterval(this.makeConnection(), this.timeout)
			this.stopKATimer()
		})
		this.tcp.on('error', (err) => {
			this.log('info', err.toString())
		})
	}

	init_TCP() {
		this.updateStatus('connecting')

		if (this.config.port == undefined) this.config.port = 10001
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
				isVisible: (options) => !options['bonjour_host'],
				width: 6,
				regex: Regex.IP,
			},
			{
				type: 'static-text',
				id: 'host-filler',
				width: 6,
				label: '',
				isVisible: (options) => !!options['bonjour_host'],
				value: '',
			},
			{
				type: 'textinput',
				useVariables: false,
				id: 'port',
				label: 'Port number',
				width: 6,
				isVisible: (options) => !options['bonjour_host'],
				regex: Regex.PORT,
				default: 10001,
			},
			{
				type: 'textinput',
				useVariables: false,
				id: 'password',
				label: 'Password protected listeners',
				width: 6,
				default: '',
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
		let variables = [
			{ variableId: 'version', name: 'VICREO Listener version' },
			{ variableId: 'license', name: 'License' },
			{ variableId: 'mouseX', name: 'mouseX' },
			{ variableId: 'mouseY', name: 'mouseY' },
		]
		this.setVariableDefinitions(variables)
	}

	initPresets() {
		this.setPresetDefinitions(GetPresetsList())
	}

	actions() {
		this.setActionDefinitions(GetActions(this))
	}
}
runEntrypoint(instance, UpgradeScripts)
