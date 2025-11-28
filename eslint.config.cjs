const eslintConfig = require('@cajuinasi/eslint-config/frontend');
const globals = require('globals');

module.exports = [
  ...eslintConfig,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['*.config.cjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
