exports.getActions = (self) => {
	let actions = {
		singleKey: {
			label: 'Hot(single)key',
			options: [
				{
					type: 'textinput',
					label: 'Single key to send',
					id: 'singleKey',
					default: 'z',
					regex: '/^.$/',
				},
			],
		},
		specialKey: {
			label: 'special key',
			options: [
				{
					type: 'dropdown',
					label: 'Special key to send',
					id: 'specialKey',
					default: 'enter',
					choices: self.CHOICES_KEYS,
				},
			],
		},
		combination: {
			label: 'Combination',
			options: [
				{
					type: 'dropdown',
					label: 'Modifier',
					id: 'key1',
					default: 'control',
					choices: self.MODIFIER_KEYS,
				},
				{
					type: 'textinput',
					label: '(Special) Key',
					id: 'key2',
					default: 'c',
				},
			],
		},
		trio: {
			label: 'Three key (trio)',
			options: [
				{
					type: 'dropdown',
					label: 'First modifier',
					id: 'key1',
					default: 'control',
					choices: self.MODIFIER_KEYS,
				},
				{
					type: 'dropdown',
					label: 'Second modifier',
					id: 'key2',
					default: 'shift',
					choices: self.MODIFIER_KEYS,
				},
				{
					type: 'textinput',
					label: '(Special) Key',
					id: 'key3',
					default: 'a',
				},
			],
		},
		press: {
			label: 'Key press',
			options: [
				{
					type: 'textinput',
					label: 'Key to press',
					id: 'keyPress',
				},
			],
		},
		release: {
			label: 'Key release',
			options: [
				{
					type: 'textinput',
					label: 'Key to release',
					id: 'keyRelease',
				},
			],
		},
		msg: {
			label: 'Send stringmessage',
			options: [
				{
					type: 'textinput',
					label: 'Type message',
					id: 'msg',
				},
			],
		},
		shell: {
			label: 'Send shell command',
			options: [
				{
					type: 'textinput',
					label: 'Type command',
					id: 'shell',
				},
			],
		},
		file: {
			label: 'Open a file',
			options: [
				{
					type: 'textinput',
					label: 'Complete file path, surround by " (read help file)',
					id: 'file',
				},
			],
		},
		sendKeypressToProcess: {
			label: 'Send KeyPress To MacOS Process',
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
					choices: self.VIRTUAL_KEYCODES_ANSI,
					minChoicesForSearch: 0,
				},
				{
					type: 'dropdown',
					label: 'Combine with modifier 1',
					id: 'modifier1',
					default: 'none',
					choices: self.MODIFIER_KEYS,
				},
				{
					type: 'dropdown',
					label: 'Combine with modifier 2',
					id: 'modifier2',
					default: 'none',
					choices: self.MODIFIER_KEYS,
				},
			],
		},
	}

	if (self.config.version == 'nodejs') {
		actions.specialKeyOS = {
			label: 'special key OS dependent',
			options: [
				{
					type: 'dropdown',
					label: 'Special key to send',
					id: 'specialKey',
					default: 'audio_mute',
					choices: self.CHOICES_KEYS_SPECIALS,
				},
			],
		}
	}
	return actions
}
