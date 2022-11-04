/**
 * File: /webpack.config.js
 * Project: app
 * File Created: 20-10-2022 05:05:21
 * Author: Clay Risser
 * -----
 * Last Modified: 04-11-2022 07:35:26
 * Modified By: Clay Risser
 * -----
 * Promanager LLC (c) Copyright 2021 - 2022
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

const dependencyTree = require('dependency-tree');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const pkg = require('./package.json');

const allowlist = [
  ...new Set([...(pkg.transpileModules || []), ...getEsmModules(['src/waitForPostgres.ts', 'src/generate.ts'])]),
];

module.exports = {
  mode: 'production',
  target: 'node',
  devtool: 'eval-cheap-module-source-map',
  entry: {
    generate: './src/bin/generate.ts',
    waitForPostgres: './src/bin/waitForPostgres.ts',
  },
  externalsPresets: {
    node: true,
  },
  externals: [
    // nodeExternals({
    //   allowlist,
    // }),
  ],
  resolve: {
    extensions: ['.cjs', '.js', '.json', '.jsx', '.mjs', '.ts', '.tsx'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(([mc]?js)|([jt]sx?))$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true,
            },
          },
        ],
      },
    ],
  },
};

function getDependentModules(filePath) {
  if (Array.isArray(filePath)) {
    return [...new Set([].concat(...filePath.map(getDependentModules)))];
  }
  const tree = dependencyTree.toList({
    directory: process.cwd(),
    filename: path.resolve(process.cwd(), filePath),
    tsConfig: path.resolve(process.cwd(), 'tsconfig.json'),
    filter: (path) => path.indexOf('node_modules') > -1,
    noTypeDefinitions: true,
  });
  return [
    ...new Set(
      tree.map((item) => item.replace(/^.*\/node_modules\/([^/]+).*$/, '$1')).filter((item) => item.indexOf('/') <= -1),
    ),
  ];
}

function filterModules(modules, filter) {
  return modules
    .map((module) => {
      try {
        return JSON.parse(
          fs.readFileSync(require.resolve(module).replace(/(node_modules\/[^/]+)\/.*$/, '$1/package.json')).toString(),
        );
      } catch (err) {
        return {};
      }
    })
    .filter(filter)
    .map((module) => module.name);
}

function getEsmModules(filePaths) {
  return filterModules(getDependentModules(filePaths), (module) => module.type === 'module');
}
