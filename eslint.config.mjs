'use strict';

import serverConfig from 'eslint-config-nodebb';
import eslintReact from '@eslint-react/eslint-plugin';
import globals from 'globals';

export default [
	{
		ignores: ['assets/**'],
	},
	...serverConfig,
	{
		...eslintReact.configs.recommended,
		files: ['public/**/*.js'],
		languageOptions: {
			parserOptions: {
				ecmaVersion: 2021,
				sourceType: 'module',
				ecmaFeatures: { jsx: true },
			},
			globals: globals.browser,
		},
	},
];
