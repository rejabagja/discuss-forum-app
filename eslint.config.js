// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh, { rules } from 'eslint-plugin-react-refresh'
import daStyle from 'eslint-config-dicodingacademy'
import pluginCypress from 'eslint-plugin-cypress/flat'

export default [{ ignores: ["dist", "**/*.config.js"] }, {
  files: ["./src/**/*.{js,jsx}"],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
    parserOptions: {
      ecmaVersion: "latest",
      ecmaFeatures: { jsx: true },
      sourceType: "module",
    },
  },
  plugins: {
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
  },
  rules: {
    ...js.configs.recommended.rules,
    ...reactHooks.configs.recommended.rules,
    "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
}, daStyle, pluginCypress.configs.recommended, {
  rules: {
    "linebreak-style": "off",
  },
}, ...storybook.configs["flat/recommended"]];
