import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		files: ["**/*.{js,mjs,cjs,ts}"]
	},
	{
		languageOptions: { globals: globals.node }
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			"quotes": ["error", "double", { "avoidEscape": true }],
			"indent": ["error", "tab"],
			"semi": ["error", "always"],
			"@typescript-eslint/no-explicit-any": "off",
		}
	}
];