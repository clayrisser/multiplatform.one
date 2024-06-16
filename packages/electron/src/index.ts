/*
 * File: /src/index.ts
 * Project: @multiplatform.one/prisma-scripts
 * File Created: 04-04-2024 15:50:39
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

// https://github.com/expo/expo-cli/blob/master/packages/webpack-config/src/loaders/createBabelLoader.ts

import path from 'path';
import type { Configuration as WebpackConfiguration, RuleSetConditionAbsolute } from 'webpack';
import type { PluginItem, PluginOptions } from '@babel/core';
import webpack from 'webpack';

interface RuleSetLogicalConditionsAbsolute {
  and?: RuleSetConditionAbsolute[];
  not?: string | RegExp | ((value: string) => boolean) | RuleSetLogicalConditionsAbsolute | RuleSetConditionAbsolute[];
  or?: RuleSetConditionAbsolute[];
}

function getModule(name: string) {
  return path.join('node_modules', name);
}

export interface ReactNativeWebpackOptions {
  projectRoot?: string;
  transpileModules?: string[];
  babel?: {
    plugins?: PluginItem[] | null | undefined;
    presets?: PluginItem[] | null | undefined;
    presetReactNativeOptions?: PluginOptions;
    presetReactOptions?: PluginOptions;
    exclude?:
      | string
      | RegExp
      | ((value: string) => boolean)
      | RuleSetLogicalConditionsAbsolute
      | webpack.RuleSetConditionAbsolute[];
  };
}

function getBabelPlugins(options) {
  const reactNativeWeb = require.resolve('babel-plugin-react-native-web');
  if (options.babel.plugins && Array.isArray(options.babel.plugins)) {
    return [reactNativeWeb, ...options.babel.plugins];
  }
  return [reactNativeWeb];
}

const defaultIncludes = [
  getModule('@expo'),
  getModule('@react'),
  getModule('@unimodules'),
  getModule('@use-expo'),
  getModule('expo'),
  getModule('native-base'),
  getModule('react-native'),
  getModule('react-navigation'),
  getModule('styled-components'),
  getModule('unimodules'),
];

const defaultExcludes = ['/node_modules', '/bower_components', '/.expo/', '(webpack)'];

export function reactNativeWebpack(config: WebpackConfiguration, options: ReactNativeWebpackOptions) {
  if (!options.babel) options.babel = {};
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.argv': 'process.argv',
      'process.env': 'process.env',
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      __DEV__: process.env.NODE_ENV !== 'production' || true,
    }),
  );
  config.plugins.push(new webpack.DefinePlugin({ process: { env: {} } }));
  const babelPlugins = getBabelPlugins(options);
  const babelPresetReactNativeOptions = options?.babel.presetReactNativeOptions ?? {};
  const babelPresetReactOptions = options?.babel.presetReactOptions ?? {};
  const babelPresets = options?.babel.presets ?? [];
  const babelExclude = options?.babel.exclude ?? [];
  const userModules = options.transpileModules?.map(getModule) ?? [];
  const modules = [...defaultIncludes, ...userModules];
  const root = options.projectRoot ?? process.cwd();
  config.module.rules.push({
    test: /\.([jt]sx?)$/,
    loader: 'babel-loader',
    include(filename) {
      if (!filename) return false;
      for (const possibleModule of modules) {
        if (filename.includes(path.normalize(possibleModule))) return true;
      }
      if (filename.includes(root)) {
        for (const excluded of defaultExcludes) {
          if (filename.includes(path.normalize(excluded))) return false;
        }
        return true;
      }
      return false;
    },
    exclude: babelExclude,
    options: {
      root,
      presets: [
        [
          require.resolve('@react-native/babel-preset'),
          {
            useTransformReactJSXExperimental: true,
            ...babelPresetReactNativeOptions,
          },
        ],
        [
          require.resolve('@babel/preset-react'),
          {
            runtime: 'automatic',
            ...babelPresetReactOptions,
          },
        ],
        ...babelPresets,
      ],
      plugins: [...babelPlugins],
    },
  });
  config.resolve.extensions = [
    ...new Set(['.web.js', '.web.jsx', '.web.ts', '.web.tsx', ...config.resolve.extensions]),
  ];
  config.resolve.alias = {
    'react-native$': 'react-native-web',
    ...config.resolve.alias,
  };
  return config;
}
