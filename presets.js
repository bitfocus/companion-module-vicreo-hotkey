exports.getPresets = function(self) {

	var presets = [];

	presets.push({
		category: 'Basic control',
		bank: {
			style: 'text',
			text: 'Command + Tab',
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
		category: 'powerpoint for mac',
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
		category: 'powerpoint for mac',
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
		category: 'powerpoint for mac',
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
		category: 'powerpoint for mac',
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
		category: 'powerpoint for mac',
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
		category: 'powerpoint for mac',
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

	return(presets);
}
