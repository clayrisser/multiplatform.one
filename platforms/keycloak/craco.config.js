/*
 * File: /craco.config.js
 * Project: @platform/keycloak
 * File Created: 14-06-2024 13:00:30
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2024
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

const cracoBabelLoader = require('craco-babel-loader');
const { lookupTranspileModules, lookupTamaguiModules } = require('@multiplatform.one/utils/transpileModules');

module.exports = {
  plugins: [
    {
      plugin: cracoBabelLoader,
      options: {
        includes: lookupTranspileModules([__dirname]).map((module) =>
          require.resolve(`${module}/package.json`).slice(0, -13),
        ),
      },
    },
  ],
  webpack: {
    configure(config) {
      return {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...(config.resolve?.alias || {}),
            'next-i18next': require.resolve('empty-module'),
            'next/config': require.resolve('empty-module'),
            'next/head': require.resolve('empty-module'),
            'next/headers': require.resolve('empty-module'),
            'next/image': require.resolve('empty-module'),
            'next/link': require.resolve('empty-module'),
            'next/router': require.resolve('empty-module'),
            next: require.resolve('empty-module'),
          },
          fallback: {
            ...(config.resolve?.fallback || {}),
          },
        },
        module: {
          ...config.module,
          rules: [
            ...config.module.rules.map((rule) => {
              if (!rule.use && !rule.resolve) rule.resolve = {};
              if (rule.resolve) rule.resolve.fullySpecified = false;
              if (rule.oneOf) {
                rule.oneOf.forEach((subRule) => {
                  if (!rule.use && !subRule.resolve) subRule.resolve = {};
                  if (rule.resolve) subRule.resolve.fullySpecified = false;
                });
              }
              return rule;
            }),
          ],
        },
      };
    },
    babel: {
      plugins: [
        'react-native-reanimated/plugin',
        [
          '@tamagui/babel-plugin',
          {
            components: lookupTamaguiModules([__dirname]),
            config: require.resolve('./src/tamagui.config.ts'),
          },
        ],
      ],
    },
  },
};