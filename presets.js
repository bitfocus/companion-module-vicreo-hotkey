const { combineRgb } = require("@companion-module/base")

exports.getPresetsList = () => {
	const presets = {}
		presets['CommandTab'] = {
				name: 'CommandTab',
				type: 'press',
				category: 'OSX',
				style: {
					text: 'Command + Tab (MAC)',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(51, 51, 255),
				},
				actions: {
					down: [
						{
							actionId: 'combination',
							options: {
								key1: 'command',
								key2: 'tab',
							},
						},
					],
					up: [],
				},
			},
	
	console.log("loading presets", presets);

	// presets.push({
	// 	category: 'OSX',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Command + x',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 255),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'combination',
	// 			options: {
	// 				key1: 'Command',
	// 				key2: 'x',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'OSX',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Command + c',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 255),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'combination',
	// 			options: {
	// 				key1: 'Command',
	// 				key2: 'c',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'OSX',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Command + v',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 255),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'combination',
	// 			options: {
	// 				key1: 'Command',
	// 				key2: 'v',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Windows',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Combination Example',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 255),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'combination',
	// 			options: {
	// 				key1: 'alt',
	// 				key2: 'tab',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Windows',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Trio example',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 200),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'trio',
	// 			options: {
	// 				key1: 'control',
	// 				key2: 'alt',
	// 				key3: 'tab',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Windows',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Ctrl + x',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 255),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'combination',
	// 			options: {
	// 				key1: 'control',
	// 				key2: 'x',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Windows',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Ctrl + c',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 255),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'combination',
	// 			options: {
	// 				key1: 'control',
	// 				key2: 'c',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Windows',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Ctrl + v',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 255),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'combination',
	// 			options: {
	// 				key1: 'control',
	// 				key2: 'v',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Windows',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Open Wordpad',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 255),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'file',
	// 			options: {
	// 				file: '"C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Accessories\\Wordpad.lnk"',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'OSX',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Open Notepad',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 255),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'file',
	// 			options: {
	// 				file: '"/System/Applications/Notes.app"',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Powerpoint for mac',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Goto slide 1',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 255),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'sendKeypressToProcess',
	// 			options: {
	// 				processSearchString: 'Microsoft PowerPoint',
	// 				virtualKeyCode: '0x12',
	// 				modifier1: 'none',
	// 				modifier2: 'none',
	// 			},
	// 		},
	// 		{
	// 			actionId: 'sendKeypressToProcess',
	// 			delay: '30',
	// 			options: {
	// 				processSearchString: 'Microsoft PowerPoint',
	// 				virtualKeyCode: '0x4C',
	// 				modifier1: 'none',
	// 				modifier2: 'none',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Powerpoint for mac',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Next\\nSlide',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 255),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'specialKey',
	// 			options: {
	// 				specialKey: 'space',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Powerpoint for mac',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Previous\\nSlide',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 255),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'specialKey',
	// 			options: {
	// 				specialKey: 'left',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Powerpoint for mac',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Start\\nfrom top',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 255),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'trio',
	// 			options: {
	// 				key1: 'shift',
	// 				key2: 'command',
	// 				key3: 'enter',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Powerpoint for mac',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Start\\nfrom current',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 255),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'combination',
	// 			options: {
	// 				key1: 'command',
	// 				key2: 'enter',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Powerpoint for mac',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Quit\\nslideshow',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 255),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'specialKey',
	// 			options: {
	// 				specialKey: 'escape',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Keynote',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Start\\nfrom current',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 255),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'trio',
	// 			options: {
	// 				key1: 'alt',
	// 				key2: 'command',
	// 				key3: 'p',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Keynote',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Next\\nSlide',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 200),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'specialKey',
	// 			options: {
	// 				specialKey: 'space',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Keynote',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Previous\\nSlide',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 200),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'specialKey',
	// 			options: {
	// 				specialKey: 'left',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Keynote',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Quit\\nslideshow',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 200),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'specialKey',
	// 			options: {
	// 				specialKey: 'escape',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Windows',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Shutdown',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 200),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'shell',
	// 			options: {
	// 				shell: 'shutdown /sg',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Windows',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Reboot',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 200),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'shell',
	// 			options: {
	// 				shell: 'shutdown /rg',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Audio',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Mute (toggle)',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 200),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'specialKeyOS',
	// 			options: {
	// 				specialKey: 'audio_mute',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Audio',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Volume Up',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 200),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'specialKeyOS',
	// 			options: {
	// 				specialKey: 'audio_vol_up',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Audio',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Volume Down',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 200),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'specialKeyOS',
	// 			options: {
	// 				specialKey: 'audio_vol_down',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Mouse',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Click left',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 200),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'mouseClick',
	// 			options: {
	// 				button: 'left',
	// 				double: 'false',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Mouse',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Click right',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 200),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'mouseClick',
	// 			options: {
	// 				button: 'right',
	// 				double: 'false',
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Mouse',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Set Mouse\\nposition',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 200),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'mousePosition',
	// 			options: {
	// 				x: 500,
	// 				y: 500,
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Mouse',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Get Mouse\\nposition',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 200),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'getMousePosition',
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Mouse',
	// 	bank: {
	// 		style: 'textwithvariables',
	// 		text: 'Mouse X:\n$(VICREO hotkey:mouseX)',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 200),
	// 	},
	// 	actions: [],
	// })

	// presets.push({
	// 	category: 'Mouse',
	// 	bank: {
	// 		style: 'textwithvariables',
	// 		text: 'Mouse Y:\n$(VICREO hotkey:mouseY)',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 200),
	// 	},
	// 	actions: [],
	// })

	// presets.push({
	// 	category: 'Mouse',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Subscribe\\nto position',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 200),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'subscribe',
	// 			options: {
	// 				subscribe: 'subscribe',
	// 				name: 'mousePosition',
	// 				interval: 1000,
	// 			},
	// 		},
	// 	],
	// })

	// presets.push({
	// 	category: 'Mouse',
	// 	bank: {
	// 		style: 'text',
	// 		text: 'Unsubscribe\\nto position',
	// 		size: '14',
	// 		color: combineRgb(255, 255, 255),
	// 		bgcolor: combineRgb(51, 51, 200),
	// 	},
	// 	actions: [
	// 		{
	// 			actionId: 'subscribe',
	// 			options: {
	// 				subscribe: 'unsubscribe',
	// 				name: 'mousePosition',
	// 				interval: 1000,
	// 			},
	// 		},
	// 	],
	// })

	return presets
}
