import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";


export default defineConfig([
	{ 
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		plugins: { js }, 
		extends: ["js/recommended"], 
		languageOptions: { globals: globals.node },
		rules: {
	  		"quotes": ["error", "double", { "avoidEscape": true }],
			"indent": ["error", "tab"],
			"semi": ["error", "always"],
			"@typescript-eslint/no-explicit-any": "off",
		}
	},
	tseslint.configs.recommended,
]);
