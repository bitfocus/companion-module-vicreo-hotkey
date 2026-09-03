import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const baseConfig = await generateEslintConfig({})

export default [
	...baseConfig,
	{
		// The module is ESM ("type": "module" in package.json); the shared config
		// only treats .mjs as modules.
		files: ['**/*.js'],
		languageOptions: { sourceType: 'module' },
	},
]
