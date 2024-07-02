/*
 * File: /.storybook/main.js
 * Project: @platform/storybook-expo
 * File Created: 01-06-2024 16:37:51
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

const fs = require('fs');
const path = require('path');

const stories = [
  // '..',
  // '../../../app',
  ...fs.readdirSync(path.resolve(__dirname, '../../../packages')).map((dir) => `../../../packages/${dir}`),
]
  .map((dir) => path.resolve(__dirname, dir))
  .map((dir) => {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter(
        (dir) =>
          dir.isDirectory() &&
          !['dist', 'lib', 'types', 'bin', 'node_modules'].includes(dir.name) &&
          !dir.name.startsWith('.') &&
          !dir.name.startsWith('_') &&
          !dir.name.startsWith('@'),
      )
      .map((dir) => `${dir.parentPath}/${dir.name}`);
  })
  .flat();

module.exports = {
  stories,
  addons: [
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-notes',
  ],
};
