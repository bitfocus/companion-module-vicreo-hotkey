const instance_skel = require('../../instance_skel')
const tcp = require('../../tcp')
const presets = require('./presets')
const actions = require('./actions')
const md5 = require('md5')
let debug = () => {}
let log

class instance extends instance_skel {
	/**
	 * Create an instance of the module
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @param {string} id - the instance ID
	 * @param {Object} config - saved user configuration parameters
	 * @since 1.0.0
	 */
	constructor(system, id, config) {
		super(system, id, config)
		this.intervalConnect = false

		// Create socket
		this.timeout = 5000
		this.retrying = false
		this.actions() // export actions

		process.on('uncaughtException', (err) => {
			console.log(err)
		})
	}

	init() {
		debug = this.debug
		log = this.log

		this.status(this.STATUS_UNKNOWN)

		this.init_TCP()
		this.initPresets()
		this.initVariables()
	}
	/**
	 * Process incoming data
	 * @param {JSON obj} data
	 */
	processData(msg) {
		console.log('msg', msg)
		switch (msg.type) {
			case 'version':
				this.setVariable('version', msg.data)
				break
			case 'license':
				this.setVariable('license', msg.data)
				break
			case 'mousePosition':
				this.setVariable('mouseX', msg.x)
				this.setVariable('mouseY', msg.y)
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
			for (const iterator of dataArray) {
				const json = ((raw) => {
					try {
						return JSON.parse(raw)
					} catch (objError) {
						if (objError instanceof SyntaxError) {
							console.error(objError.name)
						} else {
							console.error(objError.message)
						}
					}
				})(iterator)
				this.processData(json)
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
	}

	updateConfig(config) {
		this.config = config

		this.init_TCP()
		this.initPresets()
	}

	// Return config fields for web config
	config_fields() {
		return [
			{
				type: 'text',
				id: 'info',
				width: 12,
				label: 'Information',
				value:
					'This module is for the VICREO Hotkey Listener, download <a href="https://www.vicreo-listener.com/" target="_new">here</a>.',
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: this.REGEX_IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Port number',
				width: 6,
				regex: this.REGEX_PORT,
				default: 10001,
			},
			{
				type: 'textinput',
				id: 'password',
				label: 'Password protected listeners',
				width: 6,
				default: '',
			},
		]
	}

	// When module gets deleted
	destroy() {
		if (this.tcp !== undefined) {
			this.tcp.destroy()
		}
		debug('destroy', this.id)
	}

	initVariables() {
		let variables = [
			{ name: 'version', label: 'VICREO Listener version' },
			{ name: 'license', label: 'License' },
			{ name: 'mouseX', label: 'mouseX' },
			{ name: 'mouseY', label: 'mouseY' },
		]
		this.setVariableDefinitions(variables)
	}

	initPresets(updates) {
		this.setPresetDefinitions(presets.getPresets(this))
	}

	VIRTUAL_KEYCODES_ANSI = [
		{ label: 'ANSI_A', id: '0x00' },
		{ label: 'ANSI_B', id: '0x0B' },
		{ label: 'ANSI_C', id: '0x08' },
		{ label: 'ANSI_D', id: '0x02' },
		{ label: 'ANSI_E', id: '0x0E' },
		{ label: 'ANSI_F', id: '0x03' },
		{ label: 'ANSI_G', id: '0x05' },
		{ label: 'ANSI_H', id: '0x04' },
		{ label: 'ANSI_I', id: '0x22' },
		{ label: 'ANSI_J', id: '0x26' },
		{ label: 'ANSI_K', id: '0x28' },
		{ label: 'ANSI_L', id: '0x25' },
		{ label: 'ANSI_M', id: '0x2E' },
		{ label: 'ANSI_N', id: '0x2D' },
		{ label: 'ANSI_O', id: '0x1F' },
		{ label: 'ANSI_P', id: '0x23' },
		{ label: 'ANSI_Q', id: '0x0C' },
		{ label: 'ANSI_R', id: '0x0F' },
		{ label: 'ANSI_S', id: '0x01' },
		{ label: 'ANSI_T', id: '0x11' },
		{ label: 'ANSI_U', id: '0x20' },
		{ label: 'ANSI_V', id: '0x09' },
		{ label: 'ANSI_W', id: '0x0D' },
		{ label: 'ANSI_X', id: '0x07' },
		{ label: 'ANSI_Y', id: '0x10' },
		{ label: 'ANSI_Z', id: '0x06' },
		{ label: 'ANSI_0', id: '0x1D' },
		{ label: 'ANSI_1', id: '0x12' },
		{ label: 'ANSI_2', id: '0x13' },
		{ label: 'ANSI_3', id: '0x14' },
		{ label: 'ANSI_4', id: '0x15' },
		{ label: 'ANSI_5', id: '0x17' },
		{ label: 'ANSI_6', id: '0x16' },
		{ label: 'ANSI_7', id: '0x1A' },
		{ label: 'ANSI_8', id: '0x1C' },
		{ label: 'ANSI_9', id: '0x19' },
		{ label: 'Space', id: '0x31' },
		{ label: 'Return', id: '0x24' },
		{ label: 'ANSI_Equal', id: '0x18' },
		{ label: 'ANSI_Minus', id: '0x1B' },
		{ label: 'ANSI_RightBracket', id: '0x1E' },
		{ label: 'ANSI_LeftBracket', id: '0x21' },
		{ label: 'ANSI_Quote', id: '0x27' },
		{ label: 'ANSI_Semicolon', id: '0x29' },
		{ label: 'ANSI_Backslash', id: '0x2A' },
		{ label: 'ANSI_Comma', id: '0x2B' },
		{ label: 'ANSI_Slash', id: '0x2C' },
		{ label: 'ANSI_Period', id: '0x2F' },
		{ label: 'ANSI_Grave', id: '0x32' },
		{ label: 'Tab', id: '0x30' },
		{ label: 'Delete', id: '0x33' },
		{ label: 'Escape', id: '0x35' },
		{ label: 'Command', id: '0x37' },
		{ label: 'Shift', id: '0x38' },
		{ label: 'Option', id: '0x3A' },
		{ label: 'Control', id: '0x3B' },
		{ label: 'RightShift', id: '0x3C' },
		{ label: 'RightOption', id: '0x3D' },
		{ label: 'RightControl', id: '0x3E' },
		{ label: 'CapsLock', id: '0x39' },
		{ label: 'F1', id: '0x7A' },
		{ label: 'F2', id: '0x78' },
		{ label: 'F3', id: '0x63' },
		{ label: 'F4', id: '0x76' },
		{ label: 'F5', id: '0x60' },
		{ label: 'F6', id: '0x61' },
		{ label: 'F7', id: '0x62' },
		{ label: 'F8', id: '0x64' },
		{ label: 'F9', id: '0x65' },
		{ label: 'F10', id: '0x6D' },
		{ label: 'F11', id: '0x67' },
		{ label: 'F12', id: '0x6F' },
		{ label: 'F13', id: '0x69' },
		{ label: 'F14', id: '0x6B' },
		{ label: 'F15', id: '0x71' },
		{ label: 'F16', id: '0x6A' },
		{ label: 'F17', id: '0x40' },
		{ label: 'F18', id: '0x4F' },
		{ label: 'F19', id: '0x50' },
		{ label: 'F20', id: '0x5A' },
		{ label: 'Function', id: '0x3F' },
		{ label: 'VolumeUp', id: '0x48' },
		{ label: 'VolumeDown', id: '0x49' },
		{ label: 'Mute', id: '0x4A' },
		{ label: 'Help', id: '0x72' },
		{ label: 'Home', id: '0x73' },
		{ label: 'ForwardDelete', id: '0x75' },
		{ label: 'End', id: '0x77' },
		{ label: 'PageUp', id: '0x74' },
		{ label: 'PageDown', id: '0x79' },
		{ label: 'LeftArrow', id: '0x7B' },
		{ label: 'RightArrow', id: '0x7C' },
		{ label: 'UpArrow', id: '0x7E' },
		{ label: 'DownArrow', id: '0x7D' },
		{ label: 'ANSI_KeypadDecimal', id: '0x41' },
		{ label: 'ANSI_KeypadMultiply', id: '0x43' },
		{ label: 'ANSI_KeypadPlus', id: '0x45' },
		{ label: 'ANSI_KeypadClear', id: '0x47' },
		{ label: 'ANSI_KeypadDivide', id: '0x4B' },
		{ label: 'ANSI_KeypadEnter', id: '0x4C' },
		{ label: 'ANSI_KeypadMinus', id: '0x4E' },
		{ label: 'ANSI_KeypadEquals', id: '0x51' },
		{ label: 'ANSI_Keypad0', id: '0x52' },
		{ label: 'ANSI_Keypad1', id: '0x53' },
		{ label: 'ANSI_Keypad2', id: '0x54' },
		{ label: 'ANSI_Keypad3', id: '0x55' },
		{ label: 'ANSI_Keypad4', id: '0x56' },
		{ label: 'ANSI_Keypad5', id: '0x57' },
		{ label: 'ANSI_Keypad6', id: '0x58' },
		{ label: 'ANSI_Keypad7', id: '0x59' },
		{ label: 'ANSI_Keypad8', id: '0x5B' },
		{ label: 'ANSI_Keypad9', id: '0x5C' },
	]

	MODIFIER_KEYS = [
		{ label: 'None', id: 'none' },
		{ label: 'Shift', id: 'shift' },
		{ label: 'fn', id: 'fn' },
		{ label: 'Ctrl', id: 'control' },
		{ label: 'Command', id: 'command' },
		{ label: 'Option/alt', id: 'alt' },
		{ label: 'Right Shift', id: 'right_shift' },
		{ label: 'Right alt', id: 'right_alt' },
		{ label: 'Right ctrl', id: 'right_ctrl' },
	]
	CHOICES_KEYS = [
		{ label: 'Backspace', id: 'backspace' },
		{ label: 'Delete', id: 'delete' },
		{ label: 'Enter', id: 'enter' },
		{ label: 'Tab', id: 'tab' },
		{ label: 'Esc', id: 'escape' },
		{ label: 'Arrow up', id: 'up' },
		{ label: 'Arrow Down', id: 'down' },
		{ label: 'Arrow Right', id: 'right' },
		{ label: 'Arrow Left', id: 'left' },
		{ label: 'Home', id: 'home' },
		{ label: 'End', id: 'end' },
		{ label: 'Page Up', id: 'page_up' },
		{ label: 'Page Down', id: 'page_down' },
		{ label: 'F1', id: 'F1' },
		{ label: 'F2', id: 'F2' },
		{ label: 'F3', id: 'F3' },
		{ label: 'F4', id: 'F4' },
		{ label: 'F5', id: 'F5' },
		{ label: 'F6', id: 'F6' },
		{ label: 'F7', id: 'F7' },
		{ label: 'F8', id: 'F8' },
		{ label: 'F9', id: 'F9' },
		{ label: 'F10', id: 'F10' },
		{ label: 'F11', id: 'F11' },
		{ label: 'F12', id: 'F12' },
		{ label: 'F13', id: 'F13' },
		{ label: 'F14', id: 'F14' },
		{ label: 'F15', id: 'F15' },
		{ label: 'F16', id: 'F16' },
		{ label: 'F17', id: 'F17' },
		{ label: 'F18', id: 'F18' },
		{ label: 'F19', id: 'F19' },
		{ label: 'F20', id: 'F20' },
		{ label: 'F21', id: 'F21' },
		{ label: 'F22', id: 'F22' },
		{ label: 'F23', id: 'F23' },
		{ label: 'F24', id: 'F24' },
		{ label: 'Command/Windows', id: 'command' },
		{ label: 'Option/alt', id: 'alt' },
		{ label: 'Ctrl', id: 'control' },
		{ label: 'Shift', id: 'shift' },
		{ label: 'Right-Shift*', id: 'right_shift' },
		{ label: 'Space', id: 'space' },
	]
	CHOICES_KEYS_SPECIALS = [
		{ label: 'Audio mute (toggle)', id: 'audio_mute' },
		{ label: 'Audio volume down', id: 'audio_vol_down' },
		{ label: 'Audio volume up', id: 'audio_vol_up' },
		{ label: 'Play', id: 'audio_play' },
		{ label: 'Stop', id: 'audio_stop' },
		{ label: 'Pause', id: 'audio_pause' },
		{ label: 'Previous track', id: 'audio_prev' },
		{ label: 'Next track', id: 'audio_next' },
		{ label: 'Numpad 0 (No Linux)', id: 'numpad_0' },
		{ label: 'Numpad 1 (No Linux)', id: 'numpad_1' },
		{ label: 'Numpad 2 (No Linux)', id: 'numpad_2' },
		{ label: 'Numpad 3 (No Linux)', id: 'numpad_3' },
		{ label: 'Numpad 4 (No Linux)', id: 'numpad_4' },
		{ label: 'Numpad 5 (No Linux)', id: 'numpad_5' },
		{ label: 'Numpad 6 (No Linux)', id: 'numpad_6' },
		{ label: 'Numpad 7 (No Linux)', id: 'numpad_7' },
		{ label: 'Numpad 8 (No Linux)', id: 'numpad_8' },
		{ label: 'Numpad 9 (No Linux)', id: 'numpad_9' },
		{ label: 'Monitor brightness up (Only Mac)', id: 'lights_mon_up' },
		{ label: 'Monitor brightness down (Only Mac)', id: 'lights_mon_down' },
		{ label: 'Printscreen (No Mac)*', id: 'printscreen' },
		{ label: 'Insert (no Mac)*', id: 'insert' },
		{ label: 'Toggle keyboard light on/off (Only Mac)*', id: 'lights_kbd_toggle' },
		{ label: 'Keyboard light up (Only Mac)', id: 'lights_kbd_up' },
		{ label: 'Left mouse click', id: 'leftmouse' },
		{ label: 'Right mouse click', id: 'rightmouse' },

		// { label: 'Caps Lock', id: 'caps_lock' },
		// { label: 'Num Lock', id: 'num_lock'},
		// { label: 'Alt_gr', id: 'alt_gr'},
	]

	actions(system) {
		this.setActions(actions.getActions(this))
	}

	action(action) {
		let id = action.action
		let cmd = {}
		let opt = action.options

		switch (id) {
			case 'singleKey':
				cmd.key = opt.singleKey
				cmd.type = 'press'
				cmd.password = md5(this.config.password)
				break

			case 'combination':
				cmd.key = opt.key2
				cmd.type = 'combination'
				cmd.modifiers = [opt.key1]
				cmd.password = md5(this.config.password)
				// cmd = `{ "key":"${opt.key2}", "type":"combination", "modifiers":["${opt.key1}"], "password": "${md5(this.config.password)}" }`
				break

			case 'trio':
				cmd.key = opt.key3
				cmd.type = 'trio'
				cmd.modifiers = [opt.key2, opt.key1]
				cmd.password = md5(this.config.password)
				// cmd = `{ "key":"${opt.key3}", "type":"trio", "modifiers":["${opt.key1}","${opt.key2}"], "password": "${md5(this.config.password	)}" }`
				break

			case 'quartet':
				cmd.key = opt.key4
				cmd.type = 'quartet'
				cmd.modifiers = [opt.key3, opt.key2, opt.key1]
				cmd.password = md5(this.config.password)
				// cmd = `{ "key":"${opt.key3}", "type":"trio", "modifiers":["${opt.key1}","${opt.key2}"], "password": "${md5(this.config.password	)}" }`
				break

			case 'press':
				cmd.key = opt.keyPress
				cmd.type = 'down'
				cmd.password = md5(this.config.password)
				// cmd = `{ "key":"${opt.keyPress}", "type":"down", "modifiers":[], "password": "${md5(this.config.password)}" }`
				break

			case 'release':
				cmd.key = opt.keyRelease
				cmd.type = 'up'
				cmd.password = md5(this.config.password)
				// cmd = `{ "key":"${opt.keyRelease}", "type":"up", "modifiers":[], "password": "${md5(this.config.password)}" }`
				break

			case 'mousePosition':
				cmd.type = 'mousePosition'
				cmd.x = opt.x
				cmd.y = opt.y
				cmd.password = md5(this.config.password)
				break

			case 'getMousePosition':
				cmd.type = 'getMousePosition'
				cmd.password = md5(this.config.password)
				break

			case 'mouseClick':
				cmd.type = 'mouseClick'
				cmd.button = opt.button
				cmd.double = opt.double
				cmd.password = md5(this.config.password)
				break

			case 'msg':
				cmd.type = 'string'
				cmd.msg = opt.msg
				cmd.password = md5(this.config.password)
				// cmd = `{ "type":"string","msg":"${opt.msg}", "password": "${md5(this.config.password)}" }`
				break

			case 'specialKey':
				cmd.key = opt.specialKey
				cmd.type = 'pressSpecial'
				cmd.password = md5(this.config.password)
				// cmd = `{ "key":"${opt.specialKey}", "type":"pressSpecial", "modifiers":[], "password": "${md5(this.config.password)}" }`
				break

			case 'specialKeyOS':
				cmd.key = opt.specialKey
				cmd.type = 'pressSpecial'
				cmd.password = md5(this.config.password)
				// cmd = `{ "key":"${opt.specialKey}", "type":"pressSpecial", "modifiers":[], "password": "${md5(this.config.password)}" }`
				break

			case 'shell':
				cmd.type = 'shell'
				cmd.shell = opt.shell
				cmd.password = md5(this.config.password)
				// cmd = `{ "type":"shell","shell":"${opt.shell}", "password": "${md5(this.config.password)}" }`
				break

			case 'file':
				cmd.type = 'file'
				cmd.path = encodeURI(opt.file)
				cmd.password = md5(this.config.password)
				// cmd = `{ "type":"file","path":"${encodeURI(opt.file)}", "password": "${md5(this.config.password)}" }`
				break

			case 'sendKeypressToProcess':
				cmd.key = opt.virtualKeyCode
				cmd.type = 'processOSX'
				cmd.processName = opt.processSearchString
				cmd.modifiers = []
				if (opt.modifier1 != 'none') cmd.modifiers.push(opt.modifier1)
				if (opt.modifier2 != 'none') cmd.modifiers.push(opt.modifier2)
				cmd.password = md5(this.config.password)
				break

			case 'subscribe':
				cmd.type = opt.subscribe
				cmd.name = opt.name
				cmd.interval = opt.interval
				cmd.password = md5(this.config.password)
				break

			case 'custom':
				try {
					cmd = JSON.parse(opt.custom)
				} catch (error) {
					console.error('error', error)
				}
				break
		}

		console.log('cmd', JSON.stringify(cmd))
		if (cmd !== undefined) {
			if (this.tcp !== undefined) {
				debug('sending ', cmd, 'to', this.tcp.host)
				this.tcp.send(JSON.stringify(cmd))
			}
		}
	}
}
exports = module.exports = instance
