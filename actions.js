let cmd = {}

exports.GetActions = (base) => {
	let actions = {
		singleKey: {
			name: 'Hot(single)key',
			options: [
				{
					type: 'textinput',
					label: 'Single key to send',
					id: 'singleKey',
					default: 'z',
					regex: '/^.$/',
				},
			],
			callback: (event) => {
				cmd.key = event.options.singleKey
				cmd.type = 'press'

				base.sendCommand(cmd)
			},
		},
		specialKey: {
			name: 'special key',
			options: [
				{
					type: 'dropdown',
					label: 'Special key to send',
					id: 'specialKey',
					default: 'enter',
					choices: this.CHOICES_KEYS,
				},
			],
			callback: (event) => {
				cmd.key = event.options.specialKey
				cmd.type = 'pressSpecial'
				
				base.sendCommand(cmd)
			},
		},
		combination: {
			name: 'Combination',
			options: [
				{
					type: 'dropdown',
					label: 'Modifier',
					id: 'key1',
					default: 'control',
					choices: MODIFIER_KEYS,
				},
				{
					type: 'textinput',
					label: '(Special) Key',
					id: 'key2',
					default: 'c',
				},
			],
			callback: (event) => {
				cmd.key = event.options.key2
				cmd.type = 'combination'
				cmd.modifiers = [event.options.key1]
				
				base.sendCommand(cmd)
			},
		},
		trio: {
			name: 'Three key (trio, pro-action)',
			options: [
				{
					type: 'dropdown',
					label: 'First modifier',
					id: 'key1',
					default: 'control',
					choices: MODIFIER_KEYS,
				},
				{
					type: 'dropdown',
					label: 'Second modifier',
					id: 'key2',
					default: 'shift',
					choices: MODIFIER_KEYS,
				},
				{
					type: 'textinput',
					label: '(Special) Key',
					id: 'key3',
					default: 'a',
				},
			],
			callback: (event) => {
				cmd.key = event.options.key3
				cmd.type = 'trio'
				cmd.modifiers = [event.options.key2, event.options.key1]
				
				base.sendCommand(cmd)
			},
		},
		quartet: {
			name: 'Four keys (quartet, pro-action)',
			options: [
				{
					type: 'dropdown',
					label: 'First modifier',
					id: 'key1',
					default: 'control',
					choices: MODIFIER_KEYS,
				},
				{
					type: 'dropdown',
					label: 'Second modifier',
					id: 'key2',
					default: 'shift',
					choices: MODIFIER_KEYS,
				},
				{
					type: 'dropdown',
					label: 'Third modifier',
					id: 'key3',
					default: 'alt',
					choices: MODIFIER_KEYS,
				},
				{
					type: 'textinput',
					label: '(Special) Key',
					id: 'key4',
					default: 'a',
				},
			],
			callback: (event) => {
				cmd.key = event.options.key4
				cmd.type = 'quartet'
				cmd.modifiers = [event.options.key3, event.options.key2, event.options.key1]
				
				base.sendCommand(cmd)
			},
		},
		press: {
			name: 'Key press',
			options: [
				{
					type: 'textinput',
					label: 'Key to press',
					id: 'keyPress',
				},
			],
			callback: (event) => {
				cmd.key = event.options.keyPress
				cmd.type = 'down'
				
				base.sendCommand(cmd)
			},
		},
		release: {
			name: 'Key release',
			options: [
				{
					type: 'textinput',
					label: 'Key to release',
					id: 'keyRelease',
				},
			],
			callback: (event) => {
				cmd.key = event.options.keyRelease
				cmd.type = 'up'
				
				base.sendCommand(cmd)
			},
		},
		mousePosition: {
			name: 'Change mouse position (pro-action)',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'X-coordinate',
					id: 'x',
					default: 100,
					width: 6,
				},
				{
					type: 'textinput',
					useVariables: true,
					label: 'Y-coordinate',
					id: 'y',
					default: 100,
					width: 6,
				},
			],
			callback: async (event) => {
				cmd.type = 'mousePosition'
				const x = await base.parseVariablesInString(event.options.x)
				const y = await base.parseVariablesInString(event.options.y)
				cmd.x = x.trim()
				cmd.y = y.trim()
				
				base.sendCommand(cmd)
			},
		},
		mouseClick: {
			name: 'Click the mouse (pro-action)',
			options: [
				{
					type: 'dropdown',
					label: 'Which button',
					id: 'button',
					default: 'left',
					choices: [
						{ id: 'left', label: 'Left' },
						{ id: 'right', label: 'Right' },
						{ id: 'middle', label: 'Middle' },
					],
				},
				{
					type: 'dropdown',
					label: 'Double click?',
					id: 'double',
					default: 'false',
					choices: [
						{ id: 'false', label: 'Single click' },
						{ id: 'true', label: 'Double click' },
					],
				},
			],
			callback: (event) => {
				cmd.type = 'mouseClick'
				cmd.button = event.options.button
				cmd.double = event.options.double
				
				base.sendCommand(cmd)
			},
		},
		getMousePosition: {
			name: 'Get the position of the mouse on screen',
			options: [],
			callback: () => {
				cmd.type = 'getMousePosition'
				base.sendCommand(cmd)
			},
		},
		msg: {
			name: 'Send stringmessage',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Type message (variables allowed)',
					id: 'msg',
				},
			],
			callback: async (event) => {
				cmd.type = 'string'
				const msg = await base.parseVariablesInString(event.options.msg)
				cmd.msg = msg.trim()
				
				base.sendCommand(cmd)
			},
		},
		shell: {
			name: 'Send shell command (pro-action)',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Type command',
					id: 'shell',
				},
			],
			callback: async (event) => {
				cmd.type = 'shell'
				const shell = await base.parseVariablesInString(event.options.shell)
				cmd.shell = shell.trim()
				
				base.sendCommand(cmd)
			},
		},
		file: {
			name: 'Open a file (pro-action)',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Complete file path, surround by " (read help file)',
					id: 'file',
				},
			],
			callback: async (event) => {
				let filepath = await base.parseVariablesInString(event.options.file)
				cmd.type = 'file'
				cmd.path = encodeURI(filepath.trim())
				
				base.sendCommand(cmd)
			},
		},
		sendKeypressToProcess: {
			name: 'Send KeyPress To MacOS Process (pro-action)',
			options: [
				{
					type: 'textinput',
					label: 'Process Search String',
					id: 'processSearchString',
					default: 'Microsoft PowerPoint',
				},
				{
					type: 'dropdown',
					label: 'Virtual KeyCode',
					id: 'virtualKeyCode',
					default: '0x00',
					choices: VIRTUAL_KEYCODES_ANSI,
					minChoicesForSearch: 0,
				},
				{
					type: 'dropdown',
					label: 'Combine with modifier 1',
					id: 'modifier1',
					default: 'none',
					choices: MODIFIER_KEYS,
				},
				{
					type: 'dropdown',
					label: 'Combine with modifier 2',
					id: 'modifier2',
					default: 'none',
					choices: MODIFIER_KEYS,
				},
			],
			callback: (event) => {
				cmd.key = event.options.virtualKeyCode
				cmd.type = 'processOSX'
				cmd.processName = event.options.processSearchString
				cmd.modifiers = []
				if (event.options.modifier1 != 'none') cmd.modifiers.push(event.options.modifier1)
				if (event.options.modifier2 != 'none') cmd.modifiers.push(event.options.modifier2)
				
				base.sendCommand(cmd)
			},
		},
		specialKeyOS: {
			name: 'special key OS dependent (pro-action)',
			options: [
				{
					type: 'dropdown',
					label: 'Special key to send',
					id: 'specialKey',
					default: 'audio_mute',
					choices: CHOICES_KEYS_SPECIALS,
				},
			],
			callback: (event) => {
				cmd.key = event.options.specialKey
				cmd.type = 'pressSpecial'
				
				base.sendCommand(cmd)
			},
		},
		subscribe: {
			name: 'Subscribe to data (pro-action)',
			options: [
				{
					type: 'dropdown',
					label: 'Subscribe',
					id: 'subscribe',
					default: 'subscribe',
					choices: [
						{ id: 'subscribe', label: 'Subscribe' },
						{ id: 'unsubscribe', label: 'Unsubscribe' },
					],
				},
				{
					type: 'dropdown',
					label: 'Object',
					id: 'name',
					default: 'mousePosition',
					choices: [{ id: 'mousePosition', label: 'mouse position' }],
				},
				{
					type: 'number',
					label: 'Interval',
					id: 'interval',
					default: 1000,
				},
			],
			callback: (event) => {
				cmd.type = event.options.subscribe
				cmd.name = event.options.name
				cmd.interval = event.options.interval
				
				base.sendCommand(cmd)
			},
		},
		custom: {
			name: 'Custom action (pro-action)',
			options: [
				{
					type: 'textinput',
					useVariables: true,
					label: 'Custom message',
					id: 'custom',
					default: '{"type":}',
				},
			],
			callback: async (event) => {
				try {
					const custom = base.parseVariablesInString(event.options.custom)
					cmd = JSON.parse(custom.trim())
				} catch (error) {
					base.log('error', error)
				}
				base.sendCommand(cmd)
			},
		},
	}

	return actions
}
const VIRTUAL_KEYCODES_ANSI = [
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
const MODIFIER_KEYS = [
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
const CHOICES_KEYS = [
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
const CHOICES_KEYS_SPECIALS = [
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
