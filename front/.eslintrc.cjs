module.exports = {
  env: { browser: true },
  extends: [
    'react-app',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', 'jsx-a11y', 'react-hooks', '@typescript-eslint'],
  rules: {
    'import/no-unresolved': [2, { ignore: ['#'] }],
    'no-nested-ternary': 'off',
    'prettier/prettier': 'error',
    'react/jsx-curly-newline': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/require-default-props': 'off',
    'react/state-in-constructor': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
  },
};