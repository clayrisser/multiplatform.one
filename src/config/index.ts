/**
 * File: /src/config/index.ts
 * Project: multiplatform.one
 * File Created: 11-11-2022 05:58:29
 * Author: Clay Risser
 * -----
 * Last Modified: 26-01-2023 07:50:44
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2021 - 2022
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

import type { Config as TConfig } from './config';

const logger = console;
let _config: Config | undefined;

export function registerConfig(config: TConfig) {
  _config = config;
}

class Config {
  get(): Record<string, string | undefined>;
  get(key: string): string | undefined;
  get(key?: string): Record<string, string | undefined> | string | undefined {
    if (!_config) {
      logger.warn('please registerConfig(config)');
      return;
    }
    if (!key) return _config.get();
    return _config.get(key);
  }

  set(key: string, value: string) {
    if (!_config) {
      logger.warn('please registerConfig(config)');
      return;
    }
    _config?.set(key, value);
  }

  add(value: Record<string, string>) {
    if (!_config) {
      logger.warn('please registerConfig(config)');
      return;
    }
    _config?.add(value);
  }

  remove(key: string): string | undefined {
    if (!_config) {
      logger.warn('please registerConfig(config)');
      return;
    }
    return _config?.remove(key);
  }
}

export const config = new Config();

export * from './config';
