const { TCPHelper, InstanceBase, runEntrypoint, Regex, combineRgb } = require('@companion-module/base')
const md5 = require('md5')
const UpgradeScripts = require('./upgrades')
const { GetPresetsList } = require('./presets')
const { GetActions } = require('./actions')
let log

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
		// this.actions() // export actions
	}

	async init(config) {
		this.config = config
		log = this.log

		this.updateStatus('connecting')

		this.init_TCP()
		this.actions()
		this.initPresets()
		this.initVariables()
	}

	async configUpdated(config) {
		this.config = config

		this.init_TCP()
		this.actions()
		this.initPresets()
		this.initVariables()
	}

	sendCommand(cmd) {
		cmd.password = md5(this.config.password)
		console.log('cmd', JSON.stringify(cmd))
		if (cmd !== undefined) {
			if (this.tcp !== undefined) {
				this.log('debug', `${JSON.stringify(cmd)} to ${this.config.host}`)
				this.tcp.send(JSON.stringify(cmd))
			}
		}
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
				break

			default:
				console.log('Other message', msg)
				break
		}
	}

	// Functions to handle socket events
	makeConnection() {
		console.log(`Connecting to ${this.config.host}:${this.config.port}...`)
		// Create socket and bind callbacks
		this.tcp = new TCPHelper(this.config.host, this.config.port)

		this.tcp.on('status_change', (status, message) => {
			this.updateStatus(status, message)
		})
		this.tcp.on('connect', () => {
			this.log('info', 'connected')
			console.log('connected')
			clearInterval(this.intervalConnect)
			this.retrying = false
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
		})
		this.tcp.on('error', (err) => {
			this.log('info', err)
		})
	}

	init_TCP() {
		this.updateStatus('connecting')

		if (this.config.port == undefined) this.config.port = 10001
		if (this.config.host !== undefined) {
			this.makeConnection()
		}
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
				type: 'textinput',
				useVariables: false,
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				useVariables: false,
				id: 'port',
				label: 'Port number',
				width: 6,
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
