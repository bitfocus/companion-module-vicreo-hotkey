var instance_skel = require('../../instance_skel');
var tcp = require('../../tcp');
var debug;
var log;

function instance(system, id, config) {
		var self = this;

		// super-constructor
		instance_skel.apply(this, arguments);
		self.actions(); // export actions
		return self;
}

instance.prototype.init = function () {
		var self = this;

		debug = self.debug;
		log = self.log;

		self.status(self.STATUS_UNKNOWN);

		if (self.config.host !== undefined) {
			self.tcp = new tcp(self.config.host, 10001);

			self.tcp.on('status_change', function (status, message) {
				self.status(status, message);
			});

			self.tcp.on('error', function () {
				// Ignore
			});
		}
};

instance.prototype.updateConfig = function (config) {
		var self = this;
		self.config = config;

		if (self.tcp !== undefined) {
			self.tcp.destroy();
			delete self.tcp;
		}
		// Listener port 10001
		if (self.config.host !== undefined) {
			self.tcp = new tcp(self.config.host, 10001);

			self.tcp.on('status_change', function (status, message) {
				self.status(status, message);
			});

			self.tcp.on('error', function (message) {
				// ignore for now
			});
		}
};

// Return config fields for web config
instance.prototype.config_fields = function () {
		var self = this;
		return [
			{
				type: 'text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module is for the VICREO Hotkey Listener, download <a href="http://www.vicreo.eu/hotkey/" target="_new">here</a>.'
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: self.REGEX_IP
			}
		]
};

// When module gets deleted
instance.prototype.destroy = function () {
	var self = this;

		if (self.tcp !== undefined) {
			self.tcp.destroy();
		}
		debug("destroy", self.id);
};

instance.prototype.VIRTUAL_KEYCODES_ANSI = [
	{ label: 'kVK_ANSI_A', id: '0x00' },
	{ label: 'kVK_ANSI_B', id: '0x0B' },
	{ label: 'kVK_ANSI_C', id: '0x08' },
	{ label: 'kVK_ANSI_D', id: '0x02' },
	{ label: 'kVK_ANSI_E', id: '0x0E' },
	{ label: 'kVK_ANSI_F', id: '0x03' },
	{ label: 'kVK_ANSI_G', id: '0x05' },
	{ label: 'kVK_ANSI_H', id: '0x04' },
	{ label: 'kVK_ANSI_I', id: '0x22' },
	{ label: 'kVK_ANSI_J', id: '0x26' },
	{ label: 'kVK_ANSI_K', id: '0x28' },
	{ label: 'kVK_ANSI_L', id: '0x25' },
	{ label: 'kVK_ANSI_M', id: '0x2E' },
	{ label: 'kVK_ANSI_N', id: '0x2D' },
	{ label: 'kVK_ANSI_O', id: '0x1F' },
	{ label: 'kVK_ANSI_P', id: '0x23' },
	{ label: 'kVK_ANSI_Q', id: '0x0C' },
	{ label: 'kVK_ANSI_R', id: '0x0F' },
	{ label: 'kVK_ANSI_S', id: '0x01' },
	{ label: 'kVK_ANSI_T', id: '0x11' },
	{ label: 'kVK_ANSI_U', id: '0x20' },
	{ label: 'kVK_ANSI_V', id: '0x09' },
	{ label: 'kVK_ANSI_W', id: '0x0D' },
	{ label: 'kVK_ANSI_X', id: '0x07' },
	{ label: 'kVK_ANSI_Y', id: '0x10' },
	{ label: 'kVK_ANSI_Z', id: '0x06' },
	{ label: 'kVK_ANSI_0', id: '0x1D' },
	{ label: 'kVK_ANSI_1', id: '0x12' },
	{ label: 'kVK_ANSI_2', id: '0x13' },
	{ label: 'kVK_ANSI_3', id: '0x14' },
	{ label: 'kVK_ANSI_4', id: '0x15' },
	{ label: 'kVK_ANSI_5', id: '0x17' },
	{ label: 'kVK_ANSI_6', id: '0x16' },
	{ label: 'kVK_ANSI_7', id: '0x1A' },
	{ label: 'kVK_ANSI_8', id: '0x1C' },
	{ label: 'kVK_ANSI_9', id: '0x19' },
	{ label: 'kVK_Space', id: '0x31' },
	{ label: 'kVK_Return', id: '0x24' },
	{ label: 'kVK_ANSI_Equal', id: '0x18' },
	{ label: 'kVK_ANSI_Minus', id: '0x1B' },
	{ label: 'kVK_ANSI_RightBracket', id: '0x1E' },
	{ label: 'kVK_ANSI_LeftBracket', id: '0x21' },
	{ label: 'kVK_ANSI_Quote', id: '0x27' },
	{ label: 'kVK_ANSI_Semicolon', id: '0x29' },
	{ label: 'kVK_ANSI_Backslash', id: '0x2A' },
	{ label: 'kVK_ANSI_Comma', id: '0x2B' },
	{ label: 'kVK_ANSI_Slash', id: '0x2C' },
	{ label: 'kVK_ANSI_Period', id: '0x2F' },
	{ label: 'kVK_ANSI_Grave', id: '0x32' },
	{ label: 'kVK_Tab', id: '0x30' },
	{ label: 'kVK_Delete', id: '0x33' },
	{ label: 'kVK_Escape', id: '0x35' },
	{ label: 'kVK_Command', id: '0x37' },
	{ label: 'kVK_Shift', id: '0x38' },
	{ label: 'kVK_Option', id: '0x3A' },
	{ label: 'kVK_Control', id: '0x3B' },
	{ label: 'kVK_RightShift', id: '0x3C' },
	{ label: 'kVK_RightOption', id: '0x3D' },
	{ label: 'kVK_RightControl', id: '0x3E' },
	{ label: 'kVK_CapsLock', id: '0x39' },
	{ label: 'kVK_F1', id: '0x7A' },
	{ label: 'kVK_F2', id: '0x78' },
	{ label: 'kVK_F3', id: '0x63' },
	{ label: 'kVK_F4', id: '0x76' },
	{ label: 'kVK_F5', id: '0x60' },
	{ label: 'kVK_F6', id: '0x61' },
	{ label: 'kVK_F7', id: '0x62' },
	{ label: 'kVK_F8', id: '0x64' },
	{ label: 'kVK_F9', id: '0x65' },
	{ label: 'kVK_F10', id: '0x6D' },
	{ label: 'kVK_F11', id: '0x67' },
	{ label: 'kVK_F12', id: '0x6F' },
	{ label: 'kVK_F13', id: '0x69' },
	{ label: 'kVK_F14', id: '0x6B' },
	{ label: 'kVK_F15', id: '0x71' },
	{ label: 'kVK_F16', id: '0x6A' },
	{ label: 'kVK_F17', id: '0x40' },
	{ label: 'kVK_F18', id: '0x4F' },
	{ label: 'kVK_F19', id: '0x50' },
	{ label: 'kVK_F20', id: '0x5A' },
	{ label: 'kVK_Function', id: '0x3F' },
	{ label: 'kVK_VolumeUp', id: '0x48' },
	{ label: 'kVK_VolumeDown', id: '0x49' },
	{ label: 'kVK_Mute', id: '0x4A' },
	{ label: 'kVK_Help', id: '0x72' },
	{ label: 'kVK_Home', id: '0x73' },
	{ label: 'kVK_ForwardDelete', id: '0x75' },
	{ label: 'kVK_End', id: '0x77' },
	{ label: 'kVK_PageUp', id: '0x74' },
	{ label: 'kVK_PageDown', id: '0x79' },
	{ label: 'kVK_LeftArrow', id: '0x7B' },
	{ label: 'kVK_RightArrow', id: '0x7C' },
	{ label: 'kVK_UpArrow', id: '0x7E' },
	{ label: 'kVK_DownArrow', id: '0x7D' },
	{ label: 'kVK_ANSI_KeypadDecimal', id: '0x41' },
	{ label: 'kVK_ANSI_KeypadMultiply', id: '0x43' },
	{ label: 'kVK_ANSI_KeypadPlus', id: '0x45' },
	{ label: 'kVK_ANSI_KeypadClear', id: '0x47' },
	{ label: 'kVK_ANSI_KeypadDivide', id: '0x4B' },
	{ label: 'kVK_ANSI_KeypadEnter', id: '0x4C' },
	{ label: 'kVK_ANSI_KeypadMinus', id: '0x4E' },
	{ label: 'kVK_ANSI_KeypadEquals', id: '0x51' },
	{ label: 'kVK_ANSI_Keypad0', id: '0x52' },
	{ label: 'kVK_ANSI_Keypad1', id: '0x53' },
	{ label: 'kVK_ANSI_Keypad2', id: '0x54' },
	{ label: 'kVK_ANSI_Keypad3', id: '0x55' },
	{ label: 'kVK_ANSI_Keypad4', id: '0x56' },
	{ label: 'kVK_ANSI_Keypad5', id: '0x57' },
	{ label: 'kVK_ANSI_Keypad6', id: '0x58' },
	{ label: 'kVK_ANSI_Keypad7', id: '0x59' },
	{ label: 'kVK_ANSI_Keypad8', id: '0x5B' },
	{ label: 'kVK_ANSI_Keypad9', id: '0x5C' }
];

instance.prototype.MODIFIER_KEYS = [
	{ label: 'None', id: 'none'},
	{ label: 'Option/alt', id: 'alt'},
	{ label: 'Ctrl', id: 'ctrl'},
	{ label: 'Command', id: 'cmd'},
	{ label: 'Shift', id: 'shift'}
];

instance.prototype.CHOICES_KEYS = [
	{ label: 'Enter', id: 'enter' },
	{ label: 'Space', id: 'space' },
	{ label: 'Arrow up', id: 'up' },
	{ label: 'Arrow Down', id: 'down' },
	{ label: 'Arrow Left', id: 'left' },
	{ label: 'Arrow Right', id: 'right' },
	{ label: 'Delete', id: 'delete' },
	{ label: 'Esc', id: 'esc' },
	{ label: 'Tab', id: 'tab' },
	{ label: 'Page Down', id: 'page_down' },
	{ label: 'Page Up', id: 'page_up' },
	{ label: 'End', id: 'end' },
	{ label: 'Home', id: 'home' },
	{ label: 'Caps Lock', id: 'caps_lock' },
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
	{ label: 'Option/alt', id: 'alt'},
	{ label: 'Ctrl', id: 'ctrl'},
	{ label: 'Command/Windows', id: 'cmd'},
	{ label: 'Insert', id: 'insert'},
	{ label: 'Num Lock', id: 'num_lock'},
	{ label: 'Shift', id: 'shift'},
	{ label: 'Alt_gr', id: 'alt_gr'},
	{ label: 'Backspace', id: 'backspace'}
];

instance.prototype.actions = function (system) {
	var self = this;

	var actions = {
		'singleKey': {
			label: 'Hot(single)key',
			options: [ {
				type: 'textinput',
				label: 'Single key to send',
				id: 'singleKey',
				default: 'z',
				regex: '/^.$/'
				}
			]
		},
		'specialKey': {
			label: 'special key',
			options: [ {
				type: 'dropdown',
				label: 'Special key to send',
				id: 'specialKey',
				default: 'enter',
				choices: self.CHOICES_KEYS
				}
			]
		},
		'combination': {
			label: 'Combination',
			options: [ {
				type: 'dropdown',
				label: 'Modifier',
				id: 'key1',
				default: 'ctrl',
				choices: self.CHOICES_KEYS
			},
			{
				type: 'textinput',
				label: 'Key or modifier 2',
				id: 'key2',
				default: 'c'
			}
			]
		},
		'trio': {
			label: 'Three key',
			options: [ {
				type: 'dropdown',
				label: 'First modifier',
				id: 'key1',
				default: 'ctrl',
				choices: self.CHOICES_KEYS
			},
			{
				type: 'dropdown',
				label: 'Second modifier',
				id: 'key2',
				default: 'shift',
				choices: self.CHOICES_KEYS
			},
			{
				type: 'textinput',
				label: 'Key or modifier 3',
				id: 'key3',
				default: 'a'
			}
			]
		},
		'press': {
			label: 'Key press',
			options: [ {
				type: 'textinput',
				label: 'Key to press',
				id: 'keyPress'
			}
			]
		},
		'release': {
			label: 'Key release',
			options: [ {
				type: 'textinput',
				label: 'Key to release',
				id: 'keyRelease'
			}
			]
		},
		'msg': {
			label: 'Send stringmessage',
			options: [ {
				type: 'textinput',
				label: 'Type message',
				id: 'msg'
			}
			]
		},
		'file': {
			label: 'Open a file',
			options: [ {
				type: 'textinput',
				label: 'Complete file path',
				id: 'file'
			}
			]
		},
		'sendkeypresstoprocess': {
			label: 'Send KeyPress To MacOS Process',
			options: [ {
				type: 'textinput',
				label: 'Process Search String',
				id: 'processSearchString',
				default: ''
			},
			{
				type: 'dropdown',
				label: 'Virtual KeyCode',
				id: 'virtualKeyCode',
				default: '0x00',
				choices: self.VIRTUAL_KEYCODES_ANSI
			},
			{
				type: 'dropdown',
				label: 'First Modifier',
				id: 'modifier1',
				default: 'none',
				choices: self.MODIFIER_KEYS
			},
			{
				type: 'dropdown',
				label: 'Second Modifier',
				id: 'modifier2',
				default: 'none',
				choices: self.MODIFIER_KEYS
			}
			]
		},
	};
		self.setActions(actions);
};


instance.prototype.action = function (action) {
		var self = this;
		var id = action.action;
		var cmd;
		var opt = action.options;

		switch (action.action) {

			case 'singleKey':
				cmd = '<SK>' + opt.singleKey;
			break

			case 'combination':
				cmd = '<KCOMBO>'+ opt.key1 +'<AND>' + opt.key2;
			break

			case 'trio':
				cmd = '<KTRIO>'+ opt.key1 +'<AND>' + opt.key2 +'<AND2>' + opt.key3;
			break

			case 'press':
				cmd = '<KPRESS>' + opt.keyPress;
			break

			case 'release':
				cmd = '<KRELEASE>' + opt.keyRelease;
			break

			case 'msg':
				cmd = '<MSG>' + opt.msg;
			break

			case 'specialKey':
				cmd = '<SPK>' + opt.specialKey;
			break

			case 'file':
				cmd = '<FILE>' + opt.file;
			break

			case 'sendkeypresstoprocess':
				cmd = '<SKE>' + opt.virtualKeyCode + '<PROCESS>' + opt.processSearchString + '<AND>' + opt.modifier1 + '<AND2>' + opt.modifier2;
			break

		}

		if (cmd !== undefined) {
			if (self.tcp !== undefined) {
				debug('sending ', cmd, "to", self.tcp.host);
				self.tcp.send(cmd);
			}
		}
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
