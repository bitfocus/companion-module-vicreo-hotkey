/**
 * Shared helpers for the process watchdog (`subscribe` / `processState`).
 *
 * The Listener drops every subscription when the TCP connection closes, so the
 * module has to remember what it asked for and re-send it on reconnect —
 * otherwise a network blip silently stops the watchdog, which is exactly the
 * kind of failure it exists to catch.
 */

/** Matches the Listener: it clamps anything faster than this. */
const MIN_INTERVAL = 1000
const DEFAULT_INTERVAL = 10000
/** Matches the Listener's own cap. */
const MAX_PROCESSES = 20

/**
 * Split a user-typed list ("chrome.exe, Keynote") into process names.
 * @param {string} value
 * @returns {string[]} trimmed, de-duplicated, capped
 */
function parseProcessList(value) {
	const parts = String(value ?? '')
		.split(/[,\n]/)
		.map((entry) => entry.trim())
		.filter((entry) => entry !== '')
	return [...new Set(parts)].slice(0, MAX_PROCESSES)
}

/**
 * Companion variable ids only allow letters, digits and underscores, so
 * "taskmgr.exe" has to become "taskmgr_exe".
 * @param {string} processName
 * @returns {string}
 */
function variableSafeName(processName) {
	return String(processName ?? '')
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '')
}

/**
 * The four variable ids exposed for one watched process.
 * @param {string} processName
 */
function variableIds(processName) {
	const key = variableSafeName(processName)
	return {
		running: `process_${key}_running`,
		frontmost: `process_${key}_frontmost`,
		responsive: `process_${key}_responsive`,
		pid: `process_${key}_pid`,
	}
}

/**
 * Variable definitions for a whole watch list.
 * @param {string[]} processes
 */
function variableDefinitions(processes) {
	const definitions = []
	for (const processName of processes) {
		const ids = variableIds(processName)
		definitions.push(
			{ variableId: ids.running, name: `${processName}: running` },
			{ variableId: ids.frontmost, name: `${processName}: frontmost` },
			{ variableId: ids.responsive, name: `${processName}: responsive` },
			{ variableId: ids.pid, name: `${processName}: pid` },
		)
	}
	return definitions
}

/**
 * Variable values for one `processState` message.
 *
 * `responsive` stays a tri-state: the Listener reports null when it could not
 * establish responsiveness (no window to ask on Windows, a daemon or a missing
 * Accessibility permission on macOS), and flattening that to "false" would fire
 * false alarms.
 * @param {object} message
 */
function variableValues(message) {
	const ids = variableIds(message.process)
	return {
		[ids.running]: message.running ? 'true' : 'false',
		[ids.frontmost]: message.frontmost ? 'true' : 'false',
		[ids.responsive]:
			message.responsive === null || message.responsive === undefined ? 'unknown' : String(message.responsive),
		[ids.pid]: message.pid === undefined ? '' : String(message.pid),
	}
}

/** Blank values, for a process that is no longer being watched. */
function emptyVariableValues(processName) {
	const ids = variableIds(processName)
	return { [ids.running]: '', [ids.frontmost]: '', [ids.responsive]: '', [ids.pid]: '' }
}

/**
 * Clamp an interval the way the Listener would, so the UI does not promise
 * something the server will silently override.
 * @param {unknown} value
 */
function clampInterval(value) {
	const parsed = parseInt(value, 10)
	if (!Number.isFinite(parsed)) return DEFAULT_INTERVAL
	return Math.max(parsed, MIN_INTERVAL)
}

module.exports = {
	MIN_INTERVAL,
	DEFAULT_INTERVAL,
	MAX_PROCESSES,
	parseProcessList,
	variableSafeName,
	variableIds,
	variableDefinitions,
	variableValues,
	emptyVariableValues,
	clampInterval,
}
