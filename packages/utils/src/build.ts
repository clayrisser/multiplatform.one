/**
 * File: /src/build.ts
 * Project: @multiplatform.one/utils
 * File Created: 19-11-2024 20:26:31
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

import path from "node:path";
import { projectRoot } from "./helpers";

const logger = console;

export interface LookupTranspileModulesOptions {
  log?: boolean;
}

export interface LookupTamaguiModulesOptions {
  log?: boolean;
}

export function lookupTranspileModules(
  packageDirs?: string[],
  { log = true }: LookupTranspileModulesOptions = {},
) {
  const transpileModules = [
    ...new Set(
      [
        ...new Set([
          projectRoot,
          path.resolve(projectRoot, "app"),
          path.resolve(projectRoot, "packages", "ui"),
          ...(packageDirs || []),
        ]),
      ].map(
        (packageDir) =>
          require(`${packageDir}/package.json`).transpileModules || [],
      ),
    ),
  ].flat();
  if (log) logger.debug("transpileModules:", transpileModules.join(", "));
  return transpileModules;
}

export function lookupTamaguiModules(
  packageDirs?: string[],
  { log = true }: LookupTamaguiModulesOptions = {},
) {
  const tamaguiModules = [
    ...new Set([
      "tamagui",
      ...[
        ...new Set([
          projectRoot,
          path.resolve(projectRoot, "app"),
          path.resolve(projectRoot, "packages", "ui"),
          ...(packageDirs || []),
        ]),
      ].map(
        (packageDir) =>
          require(`${packageDir}/package.json`).tamaguiModules || [],
      ),
    ]),
  ].flat();
  if (log) logger.debug("tamaguiModules:", tamaguiModules.join(", "));
  return tamaguiModules;
}

export function resolveConfig(
  keys: string[] = [],
): Record<string, string | undefined> {
  return keys.reduce(
    (acc: Record<string, string | undefined>, key: string) => {
      if (process.env[key]) acc[key] = process.env[key];
      return acc;
    },
    {} as Record<string, string | undefined>,
  );
}
