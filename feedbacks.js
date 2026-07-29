const { combineRgb } = require('@companion-module/base')

/**
 * Feedbacks for the process watchdog.
 *
 * The point of watching a process from Companion is a button that changes when
 * the application dies or hangs, so the default style is an alarm red and the
 * default condition is "not running".
 */
exports.GetFeedbacks = (base) => {
	return {
		processState: {
			type: 'boolean',
			name: 'Process state (watchdog)',
			description:
				'Changes the button style based on a watched process. Requires an active "Subscribe to data" / processState subscription, or a process listed in the connection config.',
			defaultStyle: {
				bgcolor: combineRgb(200, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [
				{
					type: 'textinput',
					label: 'Process',
					id: 'process',
					default: '',
					tooltip: 'Exactly as watched, e.g. "chrome.exe" on Windows or "Keynote" on macOS.',
				},
				{
					type: 'dropdown',
					label: 'Turns on when',
					id: 'state',
					default: 'notRunning',
					choices: [
						{ id: 'notRunning', label: 'Process is NOT running' },
						{ id: 'running', label: 'Process is running' },
						{ id: 'notResponsive', label: 'Process is hung (not responsive)' },
						{ id: 'frontmost', label: 'Process is frontmost' },
						{ id: 'notFrontmost', label: 'Process is not frontmost' },
						{ id: 'noData', label: 'No data (not subscribed or never reported)' },
					],
				},
			],
			callback: (feedback) => {
				const state = base.getProcessState(feedback.options.process)

				switch (feedback.options.state) {
					case 'noData':
						return state === undefined
					case 'notRunning':
						// Never alarm on missing data: "not subscribed yet" is not
						// the same as "the application died".
						return state === undefined ? false : !state.running
					case 'running':
						return state === undefined ? false : !!state.running
					case 'notResponsive':
						// responsive === null means the Listener could not establish
						// it, which must not read as hung.
						return state === undefined ? false : state.responsive === false
					case 'frontmost':
						return state === undefined ? false : !!state.frontmost
					case 'notFrontmost':
						return state === undefined ? false : !state.frontmost
					default:
						return false
				}
			},
		},
	}
}
