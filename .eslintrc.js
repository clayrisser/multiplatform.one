const fs = require('fs');
const path = require('path');

const cspell = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.vscode/settings.json')).toString())['cSpell.words'];

module.exports = {
  extends: ['alloy', 'alloy/typescript', 'alloy/react'],
  plugins: ['spellcheck'],
  env: {
    browser: true,
    jest: true,
    jquery: true,
    mocha: true,
    node: true,
  },
  globals: {
    NodeJS: true,
  },
  rules: {
    'max-lines': ['error', 500],
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    'max-lines-per-function': ['warn', 200],
    '@typescript-eslint/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'no-empty-function': ['warn', { allow: ['constructors'] }],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        vars: 'all',
      },
    ],
    'spellcheck/spell-checker': [
      'warn',
      {
        comments: true,
        strings: true,
        identifiers: true,
        lang: 'en_US',
        skipWords: cspell,
        skipIfMatch: ['http?://[^s]*', '^[-\\w]+/[-\\w\\.]+$'],
        skipWordIfMatch: [],
        minLength: 3,
      },
    ],
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    'max-params': 'off',
    'no-param-reassign': 'off',
    'no-promise-executor-return': 'off',
  },
};
