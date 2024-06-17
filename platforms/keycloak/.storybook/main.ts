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

import path from 'path';
import publicConfig from 'app/config/public';
import type { StorybookConfig } from '@storybook/react-webpack5';
import webpack from 'webpack';
import { lookupTranspileModules } from '@multiplatform.one/utils/transpileModules';

const config: StorybookConfig = {
  stories: [
    {
      directory: path.resolve(__dirname, '../src'),
    },
  ],
  staticDirs: ['../public'],
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
    name: '@storybook/react-webpack5',
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
        // 'next-i18next': require.resolve('empty-module'),
        // 'next/config': require.resolve('empty-module'),
        // 'next/head': require.resolve('empty-module'),
        // 'next/headers': require.resolve('empty-module'),
        // 'next/image': require.resolve('empty-module'),
        // 'next/link': require.resolve('empty-module'),
        // 'next/router': require.resolve('empty-module'),
        // next: require.resolve('empty-module'),
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
        zlib: require.resolve('browserify-zlib'),
      },
      fallback: {
        ...(config.resolve?.fallback || {}),
      },
    },
    plugins: [
      ...(config.plugins || []),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  }),
  babelDefault: (config, _options) => ({
    ...config,
    presets: [...(config.presets || []), '@babel/preset-typescript'],
    plugins: ['react-native-reanimated/plugin'],
  }),
};

export default config;
