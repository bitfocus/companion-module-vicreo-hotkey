import { EmptyUpgradeScript } from '@companion-module/base'

/**
 * The connection password used to be an ordinary config field. It is a
 * `secret-text` field now, which Companion keeps in the secrets store and
 * leaves out of exports — so an existing value has to move over once.
 */
const movePasswordToSecrets = (_context, props) => {
	const result = { updatedConfig: null, updatedSecrets: null, updatedActions: [], updatedFeedbacks: [] }
	if (props.config && Object.hasOwn(props.config, 'password')) {
		const { password, ...config } = props.config
		result.updatedConfig = config
		// Do not clobber a secret that is already there.
		if (!props.secrets || !props.secrets.password) {
			result.updatedSecrets = { ...(props.secrets ?? {}), password: password ?? '' }
		}
	}
	return result
}

// The first entry is a placeholder that can never be removed: Companion tracks
// how many scripts a configuration has been through, so dropping it would
// shift every later index.
export const UpgradeScripts = [EmptyUpgradeScript, movePasswordToSecrets]
