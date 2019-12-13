exports.getPresets = function(self) {

	var presets = [];

	presets.push({
		category: 'Basic control',
		bank: {
			style: 'text',
			text: 'Command + Tab (MAC)',
			size: '14',
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(51,51,255)
		},
		actions: [
			{
				action: 'combination',
				options: {
					Key1: 'cmd',
					key2: 'tab'
				}
			}
		]
	})

	presets.push({
		category: 'Basic control',
		bank: {
			style: 'text',
			text: 'Alt + Tab (Windows)',
			size: '14',
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(51,51,255)
		},
		actions: [
			{
				action: 'combination',
				options: {
					Key1: 'alt',
					key2: 'tab'
				}
			}
		]
	})

	presets.push({
		category: 'Basic control',
		bank: {
			style: 'text',
			text: 'Ctrl + c',
			size: '14',
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(51,51,255)
		},
		actions: [
			{
				action: 'combination',
				options: {
					Key1: 'ctrl',
					key2: 'c'
				}
			}
		]
	})

	presets.push({
		category: 'Basic control',
		bank: {
			style: 'text',
			text: 'Ctrl + v',
			size: '14',
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(51,51,255)
		},
		actions: [
			{
				action: 'combination',
				options: {
					Key1: 'ctrl',
					key2: 'v'
				}
			}
		]
	})

	presets.push({
		category: 'Basic control',
		bank: {
			style: 'text',
			text: 'Esc',
			size: '14',
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(51,51,255)
		},
		actions: [
			{
				action: 'specialKey',
				options: {
					specialKey: 'esc'
				}
			}
		]
	})

	presets.push({
		category: 'Basic control',
		bank: {
			style: 'text',
			text: 'Esc',
			size: '14',
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(51,51,255)
		},
		actions: [
			{
				action: 'specialKey',
				options: {
					specialKey: 'space'
				}
			}
		]
	})

	presets.push({
		category: 'Powerpoint for mac',
		bank: {
			style: 'text',
			text: 'Goto slide 1',
			size: '14',
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(51,51,255)
		},
		actions: [
			{
				action: 'sendKeypressToProcess',
				options: {
					processSearchString: 'powerpoint',
					virtualKeyCode: '0x12',
					modifier1: 'none',
					modifier2: 'none'
				}
			},
			{
				action: 'sendKeypressToProcess',
				delay: '30',
				options: {
					processSearchString: 'powerpoint',
					virtualKeyCode: '0x4C',
					modifier1: 'none',
					modifier2: 'none'
				}
			}
		]
	})

	presets.push({
		category: 'Powerpoint for mac',
		bank: {
			style: 'text',
			text: 'Next\\nSlide',
			size: '14',
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(51,51,255)
		},
		actions: [
			{
				action: 'specialKey',
				options: {
					specialKey: 'space'
				}
			}
		]
	})

	presets.push({
		category: 'Powerpoint for mac',
		bank: {
			style: 'text',
			text: 'Previous\\nSlide',
			size: '14',
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(51,51,255)
		},
		actions: [
			{
				action: 'specialKey',
				options: {
					specialKey: 'left'
				}
			}
		]
	})

	presets.push({
		category: 'Powerpoint for mac',
		bank: {
			style: 'text',
			text: 'Start\\nfrom top',
			size: '14',
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(51,51,255)
		},
		actions: [
			{
				action: 'trio',
				options: {
					key1: 'shift',
					key2: 'cmd',
					key3: 'enter'
				}
			}
		]
	})

	presets.push({
		category: 'Powerpoint for mac',
		bank: {
			style: 'text',
			text: 'Start\\nfrom current',
			size: '14',
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(51,51,255)
		},
		actions: [
			{
				action: 'combination',
				options: {
					key1: 'cmd',
					key2: 'enter'
				}
			}
		]
	})

	presets.push({
		category: 'Powerpoint for mac',
		bank: {
			style: 'text',
			text: 'Quit\\nslideshow',
			size: '14',
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(51,51,255)
		},
		actions: [
			{
				action: 'specialKey',
				options: {
					specialKey: 'esc'
				}
			}
		]
	})

	presets.push({
		category: 'Keynote',
		bank: {
			style: 'text',
			text: 'Next\\nSlide',
			size: '14',
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(51,51,200)
		},
		actions: [
			{
				action: 'specialKey',
				options: {
					specialKey: 'space'
				}
			}
		]
	})

	presets.push({
		category: 'Keynote',
		bank: {
			style: 'text',
			text: 'Previous\\nSlide',
			size: '14',
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(51,51,200)
		},
		actions: [
			{
				action: 'specialKey',
				options: {
					specialKey: 'left'
				}
			}
		]
	})

	presets.push({
		category: 'Keynote',
		bank: {
			style: 'text',
			text: 'Quit\\nslideshow',
			size: '14',
			color: self.rgb(255,255,255),
			bgcolor: self.rgb(51,51,200)
		},
		actions: [
			{
				action: 'specialKey',
				options: {
					specialKey: 'esc'
				}
			}
		]
	})

	return(presets);
}
