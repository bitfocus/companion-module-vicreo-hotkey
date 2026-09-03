import { combineRgb } from '@companion-module/base'

/**
 * Presets, in the module-api 2.0 shape: the definitions keyed by id, plus a
 * separate structure that says how they are presented. The structure here is
 * one section per former `category`, in the order they are first defined, so
 * the preset panel reads exactly as it did before the migration.
 *
 * @returns {{ structure: import('@companion-module/base').CompanionPresetSection[], presets: import('@companion-module/base').CompanionPresetDefinitions }}
 */
export const GetPresetsList = () => {
	const presets = {}

	presets['CommandTab'] = {
		name: 'CommandTab',
		type: 'simple',
		category: 'OSX',
		style: {
			text: 'Command + Tab (MAC)',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 255),
		},
		feedbacks: [],
		steps: [
			{
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
		],
	}

	presets['commandX'] = {
		name: 'commandX',
		type: 'simple',
		category: 'OSX',
		style: {
			text: 'Command + x',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 255),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'combination',
						options: {
							key1: 'Command',
							key2: 'x',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['commandC'] = {
		name: 'commandC',
		type: 'simple',
		category: 'OSX',
		style: {
			text: 'Command + c',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 255),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'combination',
						options: {
							key1: 'Command',
							key2: 'c',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['commandV'] = {
		name: 'commandV',
		type: 'simple',
		category: 'OSX',
		style: {
			text: 'Command + v',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 255),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'combination',
						options: {
							key1: 'Command',
							key2: 'v',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['altTab'] = {
		name: 'altTab',
		type: 'simple',
		category: 'Windows',
		style: {
			text: 'Combination Example',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 255),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'combination',
						options: {
							key1: 'alt',
							key2: 'tab',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['controlAltTab'] = {
		name: 'controlAltTab',
		type: 'simple',
		category: 'Windows',
		style: {
			text: 'Trio example',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'trio',
						options: {
							key1: 'control',
							key2: 'alt',
							key3: 'tab',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['controlX'] = {
		name: 'controlX',
		type: 'simple',
		category: 'Windows',
		style: {
			text: 'Ctrl + x',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 255),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'combination',
						options: {
							key1: 'control',
							key2: 'x',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['controlC'] = {
		name: 'controlC',
		type: 'simple',
		category: 'Windows',
		style: {
			text: 'Ctrl + c',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 255),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'combination',
						options: {
							key1: 'control',
							key2: 'c',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['controlV'] = {
		name: 'controlV',
		type: 'simple',
		category: 'Windows',
		style: {
			text: 'Ctrl + v',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 255),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'combination',
						options: {
							key1: 'control',
							key2: 'v',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['openWordpad'] = {
		name: 'openWordpad',
		type: 'simple',
		category: 'Windows',
		style: {
			text: 'Open Wordpad',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 255),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'file',
						options: {
							file: '"C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Accessories\\Wordpad.lnk"',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['openNotepad'] = {
		name: 'openNotepad',
		type: 'simple',
		category: 'OSX',
		style: {
			text: 'Open Notepad',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 255),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'file',
						options: {
							file: '"/System/Applications/Notes.app"',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['gotoSlide1'] = {
		name: 'gotoSlide1',
		type: 'simple',
		category: 'Powerpoint for mac',
		style: {
			text: 'Goto slide 1',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 255),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'sendKeypressToProcess',
						options: {
							processSearchString: 'Microsoft PowerPoint',
							virtualKeyCode: '0x12',
							modifier1: 'none',
							modifier2: 'none',
						},
					},
					{
						actionId: 'sendKeypressToProcess',
						delay: 30,
						options: {
							processSearchString: 'Microsoft PowerPoint',
							virtualKeyCode: '0x4C',
							modifier1: 'none',
							modifier2: 'none',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['nextSlide'] = {
		name: 'nextSlide',
		type: 'simple',
		category: 'Powerpoint for mac',
		style: {
			text: 'Next\\nSlide',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 255),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'specialKey',
						options: {
							specialKey: 'space',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['previousSlide'] = {
		name: 'previousSlide',
		type: 'simple',
		category: 'Powerpoint for mac',
		style: {
			text: 'Previous\\nSlide',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 255),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'specialKey',
						options: {
							specialKey: 'left',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['startFromTop'] = {
		name: 'startFromTop',
		type: 'simple',
		category: 'Powerpoint for mac',
		style: {
			text: 'Start\\nfrom top',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 255),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'trio',
						options: {
							key1: 'shift',
							key2: 'command',
							key3: 'enter',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['startFromCurrent'] = {
		name: 'startFromCurrent',
		type: 'simple',
		category: 'Powerpoint for mac',
		style: {
			text: 'Start\\nfrom current',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 255),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'combination',
						options: {
							key1: 'command',
							key2: 'enter',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['quitSlideshow'] = {
		name: 'quitSlideshow',
		type: 'simple',
		category: 'Powerpoint for mac',
		style: {
			text: 'Quit\\nslideshow',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 255),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'specialKey',
						options: {
							specialKey: 'escape',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['startFromCurrentOSX'] = {
		name: 'startFromCurrentOSX',
		type: 'simple',
		category: 'Keynote',
		style: {
			text: 'Start\\nfrom current',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 255),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'trio',
						options: {
							key1: 'alt',
							key2: 'command',
							key3: 'p',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['nextSlideOSX'] = {
		name: 'nextSlideOSX',
		type: 'simple',
		category: 'Keynote',
		style: {
			text: 'Next\\nSlide',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'specialKey',
						options: {
							specialKey: 'space',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['previousSlideOSX'] = {
		name: 'previousSlideOSX',
		type: 'simple',
		category: 'Keynote',
		style: {
			text: 'Previous\\nSlide',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'specialKey',
						options: {
							specialKey: 'left',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['quitSlideshowOSX'] = {
		name: 'quitSlideshowOSX',
		type: 'simple',
		category: 'Keynote',
		style: {
			text: 'Quit\\nslideshow',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'specialKey',
						options: {
							specialKey: 'escape',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['shutdownWindows'] = {
		name: 'shutdownWindows',
		type: 'simple',
		category: 'Windows',
		style: {
			text: 'Shutdown',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'shell',
						options: {
							shell: 'shutdown /sg',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['rebootWindows'] = {
		name: 'rebootWindows',
		type: 'simple',
		category: 'Windows',
		style: {
			text: 'Reboot',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'shell',
						options: {
							shell: 'shutdown /rg',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['screenshotOSX5'] = {
		name: 'screenshotOSX5',
		type: 'simple',
		category: 'OSX',
		style: {
			text: 'Screenshot (full)',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'shell',
						options: {
							shell: 'screencapture ~/Desktop/screenshot.png',
						},
					},
				],
				up: [],
			},
		],
	}
	presets['screenshotOSX4'] = {
		name: 'screenshotOSX4',
		type: 'simple',
		category: 'OSX',
		style: {
			text: 'Screenshot (part)',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'shell',
						options: {
							shell: 'screencapture -i ~/Desktop/screenshot.png',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['mute'] = {
		name: 'mute',
		type: 'simple',
		category: 'Audio',
		style: {
			text: 'Mute (toggle)',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'specialKeyOS',
						options: {
							specialKey: 'audio_mute',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['volumeUp'] = {
		name: 'volumeUp',
		type: 'simple',
		category: 'Audio',
		style: {
			text: 'Volume Up',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'specialKeyOS',
						options: {
							specialKey: 'audio_vol_up',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['volumeDown'] = {
		name: 'volumeDown',
		type: 'simple',
		category: 'Audio',
		style: {
			text: 'Volume Down',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'specialKeyOS',
						options: {
							specialKey: 'audio_vol_down',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['clickLeft'] = {
		name: 'clickLeft',
		type: 'simple',
		category: 'Mouse',
		style: {
			text: 'Click left',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'mouseClick',
						options: {
							button: 'left',
							double: 'false',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['clickHold'] = {
		name: 'clickHold',
		type: 'simple',
		category: 'Mouse',
		style: {
			text: 'Click and Hold mouse',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'mouseClickHold',
						options: { button: 'right' },
					},
				],
				up: [],
			},
		],
	}

	presets['clickRelease'] = {
		name: 'clickRelease',
		type: 'simple',
		category: 'Mouse',
		style: {
			text: 'Click and Release mouse',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'mouseClickRelease',
						options: { button: 'right' },
					},
				],
				up: [],
			},
		],
	}
	presets['dragdrop'] = {
		name: 'draganddrop',
		type: 'simple',
		category: 'Mouse',
		style: {
			text: 'Drag and Drop mouse',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'mousePosition',
						delay: 1000,
						options: {
							x: 500,
							y: 500,
						},
					},
					{
						actionId: 'mouseClickHold',
						delay: 1500,
						options: { button: 'left' },
					},
					{
						actionId: 'mousePosition',
						delay: 2000,
						options: {
							x: 1000,
							y: 600,
						},
					},
					{
						actionId: 'mouseClickRelease',
						delay: 2500,
						options: { button: 'left' },
					},
				],
				up: [],
			},
		],
	}

	presets['clickRight'] = {
		name: 'clickRight',
		type: 'simple',
		category: 'Mouse',
		style: {
			text: 'Click right',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'mouseClick',
						options: {
							button: 'right',
							double: 'false',
						},
					},
				],
				up: [],
			},
		],
	}

	presets['setMousePosition'] = {
		name: 'setMousePosition',
		type: 'simple',
		category: 'Mouse',
		style: {
			text: 'Set Mouse\\nposition',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'mousePosition',
						delay: 20,
						options: {
							x: 500,
							y: 500,
						},
					},
				],
				up: [],
			},
		],
	}

	presets['getMousePosition'] = {
		name: 'getMousePosition',
		type: 'simple',
		category: 'Mouse',
		style: {
			text: 'Get Mouse\\nposition',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'getMousePosition',
					},
				],
				up: [],
			},
		],
	}

	presets['mouseX'] = {
		name: 'mouseX',
		type: 'simple',
		category: 'Mouse',
		style: {
			text: 'Mouse X:\n$(VICREO hotkey:mouseX)',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [{ down: [], up: [] }],
	}

	presets['mouseY'] = {
		name: 'mouseY',
		type: 'simple',
		category: 'Mouse',
		style: {
			text: 'Mouse Y:\n$(VICREO hotkey:mouseY)',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [{ down: [], up: [] }],
	}

	presets['mouseScroll_up'] = {
		name: 'mouseScroll',
		type: 'simple',
		category: 'Mouse',
		style: {
			text: 'Scroll up',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'mouseScroll',
						options: {
							x_axis: 0,
							y_axis: 50,
						},
					},
				],
				up: [],
			},
		],
	}
	presets['mouseScroll_down'] = {
		name: 'mouseScroll',
		type: 'simple',
		category: 'Mouse',
		style: {
			text: 'Scroll down',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'mouseScroll',
						options: {
							x_axis: 0,
							y_axis: -50,
						},
					},
				],
				up: [],
			},
		],
	}

	presets['subscribeToPosition'] = {
		name: 'subscribeToPosition',
		type: 'simple',
		category: 'Mouse',
		style: {
			text: 'Subscribe\\nto position',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'subscribe',
						options: {
							subscribe: 'subscribe',
							name: 'mousePosition',
							interval: 1000,
						},
					},
				],
				up: [],
			},
		],
	}

	presets['unsubscribe'] = {
		name: 'unsubscribe',
		type: 'simple',
		category: 'Mouse',
		style: {
			text: 'Unsubscribe\\nto position',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'subscribe',
						options: {
							subscribe: 'unsubscribe',
							name: 'mousePosition',
							interval: 1000,
						},
					},
				],
				up: [],
			},
		],
	}

	presets['license'] = {
		name: 'license',
		type: 'simple',
		category: 'Misc',
		style: {
			text: 'Set license key',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'setLicenseKey',
						options: {},
					},
				],
				up: [],
			},
		],
	}

	// A watchdog button: shows the process it watches and goes red when that
	// application stops running. Fill in the process name after dragging it out.
	presets['processWatchdog'] = {
		name: 'Process watchdog',
		type: 'simple',
		category: 'Watchdog',
		style: {
			text: 'chrome.exe\\n$(vicreo-hotkey:process_chrome_exe_running)',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 100, 0),
		},
		feedbacks: [
			{
				feedbackId: 'processState',
				options: {
					process: 'chrome.exe',
					state: 'notRunning',
				},
				style: {
					bgcolor: combineRgb(200, 0, 0),
					color: combineRgb(255, 255, 255),
				},
			},
		],
		steps: [{ down: [], up: [] }],
	}

	presets['processWatchdogHung'] = {
		name: 'Process hung',
		type: 'simple',
		category: 'Watchdog',
		style: {
			text: 'chrome.exe\\nhung?',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 100, 0),
		},
		feedbacks: [
			{
				feedbackId: 'processState',
				options: {
					process: 'chrome.exe',
					state: 'notResponsive',
				},
				style: {
					bgcolor: combineRgb(230, 120, 0),
					color: combineRgb(255, 255, 255),
				},
			},
		],
		steps: [{ down: [], up: [] }],
	}

	presets['subscribeToProcesses'] = {
		name: 'subscribeToProcesses',
		type: 'simple',
		category: 'Watchdog',
		style: {
			text: 'Subscribe\\nto processes',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'subscribe',
						options: {
							subscribe: 'subscribe',
							name: 'processState',
							processes: 'chrome.exe',
							sendAlways: false,
							interval: 10000,
						},
					},
				],
				up: [],
			},
		],
	}

	presets['unsubscribeFromProcesses'] = {
		name: 'unsubscribeFromProcesses',
		type: 'simple',
		category: 'Watchdog',
		style: {
			text: 'Unsubscribe\\nfrom processes',
			size: '14',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(51, 51, 200),
		},
		feedbacks: [],
		steps: [
			{
				down: [
					{
						actionId: 'subscribe',
						options: {
							subscribe: 'unsubscribe',
							name: 'processState',
							processes: '',
							sendAlways: false,
							interval: 10000,
						},
					},
				],
				up: [],
			},
		],
	}

	return splitIntoStructure(presets)
}

/**
 * Turn `{ id: { category, ...preset } }` into what `setPresetDefinitions`
 * takes in module-api 2.0: presets without `category`, and a structure of one
 * section per category listing its preset ids.
 */
const splitIntoStructure = (withCategories) => {
	const presets = {}
	const sections = new Map()
	for (const [id, { category, ...preset }] of Object.entries(withCategories)) {
		presets[id] = preset
		const sectionId = category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
		if (!sections.has(sectionId)) sections.set(sectionId, { id: sectionId, name: category, definitions: [] })
		sections.get(sectionId).definitions.push(id)
	}
	return { structure: [...sections.values()], presets }
}
