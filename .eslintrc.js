/**
 * File: /.eslintrc.js
 * Project: multiplatform.one
 * File Created: 25-11-2022 10:12:12
 * Author: Clay Risser
 * -----
 * Last Modified: 14-05-2023 02:59:18
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2022 - 2023
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    JSX: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['!.storybook'],
  rules: {
    '@typescript-eslint/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    '@typescript-eslint/consistent-type-imports': 'error',
    'max-lines': ['error', 500],
    'max-lines-per-function': ['warn', 300],
    'no-empty-function': ['warn', { allow: ['constructors'] }],
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    complexity: ['error', 50],
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
