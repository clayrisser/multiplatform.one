/*
 * File: /src/tamaguiModules.ts
 * Project: @multiplatform.one/utils
 * File Created: 16-06-2024 11:47:51
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

const logger = console;
const projectRoot = require.resolve('react/package.json').slice(0, -32);

export interface LookupTamaguiModulesOptions {
  log?: boolean;
}

export function lookupTamaguiModules(packageDirs?: string[], { log = true }: LookupTamaguiModulesOptions = {}) {
  const tamaguiModules = [
    ...new Set([
      'tamagui',
      ...[
        ...new Set([
          projectRoot,
          path.resolve(projectRoot, 'app'),
          path.resolve(projectRoot, 'packages', 'ui'),
          ...(packageDirs || []),
        ]),
      ].map((packageDir) => require(`${packageDir}/package.json`).tamaguiModules || []),
    ]),
  ];
  if (log) logger.debug('tamaguiModules:', tamaguiModules.join(', '));
  return tamaguiModules;
}
