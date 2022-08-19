const { tcp, InstanceBase, runEntrypoint, Regex } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const presets = require('./presets')
const actions = require('./actions')
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
		this.actions() // export actions
	}

	async init(config) {
		this.config = config
		log = this.log

		this.status(this.STATUS_UNKNOWN)

		this.init_TCP()
		this.initPresets()
		this.initVariables()
	}

	async configUpdated(config) {
		this.config = config

		this.init_TCP()
		this.initPresets()
	}
	/**
	 * Process incoming data
	 * @param {JSON obj} data
	 */
	processData(msg) {
		console.log('msg', msg)
		switch (msg.type) {
			case 'version':
				this.setVariableValues({ version: msg.data})
				break
			case 'license':
				this.setVariableValues({ license: msg.data})
				break
			case 'mousePosition':
				this.setVariableValues({ mouseX: msg.x, mouseY: msg.y})
				break
			case 'subscribe':
			case 'unsubscribe':
			case 'getMousePosition':
				break

			default:
				console.log('Wrong type', msg)
				break
		}
	}

	// Functions to handle socket events
	makeConnection() {
		console.log(`Connecting to ${this.config.host}:${this.config.port}...`)
		// Create socket and bind callbacks
		this.tcp = new tcp(this.config.host, this.config.port)

		this.tcp.on('status_change', (status, message) => {
			this.status(status, message)
		})
		this.tcp.on('connect', () => {
			this.log('info', 'connected')
			console.log('connected')
			this.status(this.STATUS_OK)
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

	endEventHandler() {
		console.log('end')
	}
	timeoutEventHandler() {
		console.log('timeout')
	}
	drainEventHandler() {
		console.log('drain')
	}
	errorEventHandler() {
		console.log('error')
	}

	init_TCP() {
		this.status(this.STATUS_UNKNOWN)

		if (this.config.port == undefined) this.config.port = 10001
		if (this.config.host !== undefined) {
			this.makeConnection()
		}
		this.setActionDefinitions(actions.getActions())
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
		this.log('debug', 'destroy')
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

	initPresets(updates) {
		this.setPresetDefinitions(presets.getPresets(this))
	}

	updateActions() {
		this.setActionDefinitions(actions.getActions())
	}
}
runEntrypoint(instance, UpgradeScripts)
