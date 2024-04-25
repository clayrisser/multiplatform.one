/*
 *  File: /metro.config.js
 *  Project: @platform/expo
 *  File Created: 04-04-2024 15:50:39
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2024
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @type {import('expo/metro-config')}
 */

const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(__dirname, '../..');
const config = getDefaultConfig(projectRoot);
config.resolver.resolverMainFields.unshift('sbmodern');
config.watchFolders = [workspaceRoot];
config.transformer = config.transformer || {};
config.transformer.minifierPath = require.resolve('metro-minify-terser');
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'node:path': require.resolve('path-browserify'),
  'node:process': require.resolve('process/browser'),
  'node:url': require.resolve('url-polyfill'),
  buffer: require.resolve('buffer/'),
  fs: require.resolve('browserify-fs'),
  path: require.resolve('path-browserify'),
  process: require.resolve('process/browser'),
  stream: require.resolve('readable-stream'),
  url: require.resolve('url-polyfill'),
  zlib: require.resolve('browserify-zlib'),
};
config.resetCache = true;
console.log(config.resolver.sourceExts);
console.log(config.resolver.platforms);
module.exports = config;
