/*
 * File: /.storybook/main.ts
 * Project: @platform/storybook
 * File Created: 12-06-2024 08:26:15
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

import fs from 'fs';
import path from 'path';
import publicConfig from 'app/config/public';
import type { StorybookConfig } from '@storybook/nextjs';
import { lookupTranspileModules, lookupTamaguiModules } from '@multiplatform.one/utils/transpileModules';

const stories = [
  '..',
  '../../../app',
  ...fs.readdirSync(path.resolve(__dirname, '../../../packages')).map((dir) => `../../../packages/${dir}`),
]
  .map((dir) => path.resolve(__dirname, dir))
  .map((parentDir) => {
    return fs
      .readdirSync(parentDir, { withFileTypes: true })
      .filter(
        (dir) =>
          dir.isDirectory() &&
          !['dist', 'lib', 'types', 'bin', 'node_modules'].includes(dir.name) &&
          !dir.name.startsWith('.') &&
          !dir.name.startsWith('_') &&
          !dir.name.startsWith('@'),
      )
      .map((dir) => `${parentDir}/${dir.name}`);
  })
  .flat();

const config: StorybookConfig = {
  stories,
  addons: [
    '@etchteam/storybook-addon-status',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-notes',
    '@storybook/addon-storyshots',
    '@storybook/addon-storysource',
    '@storybook/addon-webpack5-compiler-babel',
    'addon-screen-reader',
    'storybook-addon-paddings',
    'storybook-color-picker',
    'storybook-dark-mode',
    {
      name: '@storybook/addon-react-native-web',
      options: {
        babelPlugins: ['react-native-reanimated/plugin'],
        modulesToTranspile: lookupTranspileModules([path.resolve(__dirname, '..')]),
      },
    },
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: true,
        backgrounds: false,
        docs: true,
        toolbars: true,
        viewport: true,
        controls: true,
      },
    },
    '@storybook/addon-styling',
  ],
  core: {
    disableTelemetry: true,
  },
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  features: {
    buildStoriesJson: false,
    storyStoreV7: false,
  },
  docs: {
    autodocs: 'tag',
  },
  env: (config) => ({
    ...config,
    TAMAGUI_TARGET: 'web',
    ...(publicConfig as Record<string, string>),
  }),
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    skipBabel: false,
    reactDocgenTypescriptOptions: {
      propFilter: (prop) => (prop.parent ? !/node_modules\/(?!tamagui)/.test(prop.parent.fileName) : true),
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
    },
  },
  webpackFinal: async (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias || {}),
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
        zlib: require.resolve('browserify-zlib'),
      },
      fallback: {
        ...(config.resolve?.fallback || {}),
      },
    },
    plugins: [...(config.plugins || [])],
  }),
  babelDefault: (config, _options) => ({
    ...config,
    presets: [...(config.presets || []), '@babel/preset-typescript'],
    plugins: [
      // TODO: do this only in production
      ...(Math.random() * 0
        ? [
            '@tamagui/babel-plugin',
            {
              components: lookupTamaguiModules([path.resolve(__dirname, '..')]),
              config: require.resolve('../tamagui.config.ts'),
            },
          ]
        : []),
      'react-native-reanimated/plugin',
    ],
  }),
};

export default config;
