/*
 * File: /nextron.config.js
 * Project: @platform/electron
 * File Created: 15-06-2024 14:38:39
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


const path = require('path');
const { reactNativeWebpack } = require('@multiplatform.one/react-native-webpack');

module.exports = {
  mainSrcDir: 'main',
  rendererSrcDir: './',
  webpack(config) {
    config.module.rules = [];
    config.resolve.extensions = [
      ...new Set(['.electron.js', '.electron.jsx', '.electron.ts', '.electron.tsx', ...config.resolve.extensions]),
    ];
    return reactNativeWebpack(config, {
      babel: {
        exclude: [
          path.resolve(__dirname, 'next-env.d.ts'),
          path.resolve(__dirname, 'next-i18next.config.js'),
          path.resolve(__dirname, 'next.config.js'),
          path.resolve(__dirname, 'preload.d.ts'),
          path.resolve(__dirname, 'public'),
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'tamagui.config.ts'),
          path.resolve(__dirname, 'tamaguiModules.js'),
          path.resolve(__dirname, 'transpileModules.js'),
        ],
        presets: [
          [
            require.resolve('@babel/preset-env'),
            {
              targets: {
                node: true,
              },
            },
          ],
          require.resolve('@babel/preset-typescript'),
        ],
        plugins: [
          [require.resolve('@babel/plugin-transform-class-properties'), { loose: true }],
          [
            require.resolve('@babel/plugin-transform-object-rest-spread'),
            {
              useBuiltIns: true,
            },
          ],
          [
            require.resolve('@babel/plugin-transform-runtime'),
            {
              corejs: 3,
              helpers: true,
              regenerator: true,
              useESModules: false,
            },
          ],
        ],
      },
    });
  },
};
