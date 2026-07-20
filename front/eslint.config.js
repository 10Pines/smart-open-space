import js from '@eslint/js'
import globals from 'globals'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import prettierConfig from 'eslint-config-prettier'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooks.configs.flat['recommended-latest'],
  importPlugin.flatConfigs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      // React Compiler-oriented rules (nuevas en v7): el proyecto sigue en React 16
      // sin Compiler, así que quedan en warn para no romper el lint por deuda
      // preexistente. rules-of-hooks/exhaustive-deps quedan en error (heredadas de v2.x).
      ...Object.fromEntries(
        Object.keys(reactHooks.configs.flat['recommended-latest'].rules)
          .filter((rule) => !['react-hooks/rules-of-hooks', 'react-hooks/exhaustive-deps'].includes(rule))
          .map((rule) => [rule, 'warn']),
      ),
      // Los aliases de import (#helpers, #shared, etc.) los define vite.config.js;
      // el resolver de eslint-plugin-import no los conoce. Vite/el build ya
      // valida la resolución real de estos imports.
      'import/no-unresolved': 'off',
      'no-unused-vars': 'warn',
      'react/prop-types': 'off',
    },
  },
  {
    files: ['**/__tests__/**', '**/*.test.{js,jsx}'],
    languageOptions: {
      // vite.config.js define test.globals=true: vitest inyecta describe/test/expect
      // como globals en runtime, sin necesidad de importarlos.
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.vitest,
      },
    },
  },
  prettierConfig,
]
