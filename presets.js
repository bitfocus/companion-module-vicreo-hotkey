exports.getPresets = function (self) {
	var presets = []

	presets.push({
		category: 'OSX',
		bank: {
			style: 'text',
			text: 'Command + Tab (MAC)',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 255),
		},
		actions: [
			{
				action: 'combination',
				options: {
					key1: 'command',
					key2: 'tab',
				},
			},
		],
	})

	presets.push({
		category: 'OSX',
		bank: {
			style: 'text',
			text: 'Command + x',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 255),
		},
		actions: [
			{
				action: 'combination',
				options: {
					key1: 'Command',
					key2: 'x',
				},
			},
		],
	})

	presets.push({
		category: 'OSX',
		bank: {
			style: 'text',
			text: 'Command + c',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 255),
		},
		actions: [
			{
				action: 'combination',
				options: {
					key1: 'Command',
					key2: 'c',
				},
			},
		],
	})

	presets.push({
		category: 'OSX',
		bank: {
			style: 'text',
			text: 'Command + v',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 255),
		},
		actions: [
			{
				action: 'combination',
				options: {
					key1: 'Command',
					key2: 'v',
				},
			},
		],
	})

	presets.push({
		category: 'Windows',
		bank: {
			style: 'text',
			text: 'Alt + Tab (Windows)',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 255),
		},
		actions: [
			{
				action: 'combination',
				options: {
					key1: 'alt',
					key2: 'tab',
				},
			},
		],
	})

	presets.push({
		category: 'Windows',
		bank: {
			style: 'text',
			text: 'Ctrl + x',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 255),
		},
		actions: [
			{
				action: 'combination',
				options: {
					key1: 'control',
					key2: 'x',
				},
			},
		],
	})

	presets.push({
		category: 'Windows',
		bank: {
			style: 'text',
			text: 'Ctrl + c',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 255),
		},
		actions: [
			{
				action: 'combination',
				options: {
					key1: 'control',
					key2: 'c',
				},
			},
		],
	})

	presets.push({
		category: 'Windows',
		bank: {
			style: 'text',
			text: 'Ctrl + v',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 255),
		},
		actions: [
			{
				action: 'combination',
				options: {
					key1: 'control',
					key2: 'v',
				},
			},
		],
	})

	presets.push({
		category: 'Windows',
		bank: {
			style: 'text',
			text: 'Open Notepad',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 255),
		},
		actions: [
			{
				action: 'file',
				options: {
					file: '"C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Accessories\\Notepad.lnk"',
				},
			},
		],
	})

	presets.push({
		category: 'Powerpoint for mac',
		bank: {
			style: 'text',
			text: 'Goto slide 1',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 255),
		},
		actions: [
			{
				action: 'sendKeypressToProcess',
				options: {
					processSearchString: 'Microsoft PowerPoint',
					virtualKeyCode: '0x12',
					modifier1: 'none',
					modifier2: 'none',
				},
			},
			{
				action: 'sendKeypressToProcess',
				delay: '30',
				options: {
					processSearchString: 'Microsoft PowerPoint',
					virtualKeyCode: '0x4C',
					modifier1: 'none',
					modifier2: 'none',
				},
			},
		],
	})

	presets.push({
		category: 'Powerpoint for mac',
		bank: {
			style: 'text',
			text: 'Next\\nSlide',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 255),
		},
		actions: [
			{
				action: 'specialKey',
				options: {
					specialKey: 'space',
				},
			},
		],
	})

	presets.push({
		category: 'Powerpoint for mac',
		bank: {
			style: 'text',
			text: 'Previous\\nSlide',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 255),
		},
		actions: [
			{
				action: 'specialKey',
				options: {
					specialKey: 'left',
				},
			},
		],
	})

	presets.push({
		category: 'Powerpoint for mac',
		bank: {
			style: 'text',
			text: 'Start\\nfrom top',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 255),
		},
		actions: [
			{
				action: 'trio',
				options: {
					key1: 'shift',
					key2: 'command',
					key3: 'enter',
				},
			},
		],
	})

	presets.push({
		category: 'Powerpoint for mac',
		bank: {
			style: 'text',
			text: 'Start\\nfrom current',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 255),
		},
		actions: [
			{
				action: 'combination',
				options: {
					key1: 'command',
					key2: 'enter',
				},
			},
		],
	})

	presets.push({
		category: 'Powerpoint for mac',
		bank: {
			style: 'text',
			text: 'Quit\\nslideshow',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 255),
		},
		actions: [
			{
				action: 'specialKey',
				options: {
					specialKey: 'escape',
				},
			},
		],
	})

	presets.push({
		category: 'Keynote',
		bank: {
			style: 'text',
			text: 'Start\\nfrom current',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 255),
		},
		actions: [
			{
				action: 'trio',
				options: {
					key1: 'alt',
					key2: 'command',
					key3: 'p',
				},
			},
		],
	})

	presets.push({
		category: 'Keynote',
		bank: {
			style: 'text',
			text: 'Next\\nSlide',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 200),
		},
		actions: [
			{
				action: 'specialKey',
				options: {
					specialKey: 'space',
				},
			},
		],
	})

	presets.push({
		category: 'Keynote',
		bank: {
			style: 'text',
			text: 'Previous\\nSlide',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 200),
		},
		actions: [
			{
				action: 'specialKey',
				options: {
					specialKey: 'left',
				},
			},
		],
	})

	presets.push({
		category: 'Keynote',
		bank: {
			style: 'text',
			text: 'Quit\\nslideshow',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 200),
		},
		actions: [
			{
				action: 'specialKey',
				options: {
					specialKey: 'escape',
				},
			},
		],
	})

	presets.push({
		category: 'Windows',
		bank: {
			style: 'text',
			text: 'Shutdown',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 200),
		},
		actions: [
			{
				action: 'shell',
				options: {
					shell: 'shutdown /sg',
				},
			},
		],
	})

	presets.push({
		category: 'Windows',
		bank: {
			style: 'text',
			text: 'Reboot',
			size: '14',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(51, 51, 200),
		},
		actions: [
			{
				action: 'shell',
				options: {
					shell: 'shutdown /rg',
				},
			},
		],
	})

	return presets
}
