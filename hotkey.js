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
				value: 'This module is for the VICREO Hotkey Listener, download <a href="https://github.com/JeffreyDavidsz/VICREO-Listener/releases" target="_new">here</a>.'
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
				default: 'Ctrl',
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
		}
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
