/**
 * File: /src/config/config.native.ts
 * Project: multiplatform.one
 * File Created: 19-11-2022 11:58:58
 * Author: Clay Risser
 * -----
 * Last Modified: 21-02-2023 15:09:35
 * Modified By: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2022
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

import constants from 'expo-constants';
import type { IConfig } from './types';

export class Config implements IConfig {
  private _config: Record<string, string | undefined> = {};

  constructor(config: Record<string, string | undefined> = {}) {
    this._config = {
      ...Object.entries(config).reduce<Record<string, string | undefined>>(
        (config, [key, value]: [string, string | undefined]) => {
          if (typeof value !== 'undefined') config[key] = value;
          return config;
        },
        {},
      ),
      ...(constants.expoConfig?.extra || {}),
    };
  }

  get(): Record<string, string | undefined>;
  get(key: string): string | undefined;
  get(key?: string): Record<string, string | undefined> | string | undefined {
    if (!key) return this._config;
    return this._config[key];
  }

  set(key: string, value: string) {
    this._config[key] = value;
  }

  add(value: Record<string, string>) {
    this._config = {
      ...this._config,
      ...value,
    };
  }

  remove(key: string): string | undefined {
    const value = this.get(key);
    delete this._config[key];
    return value;
  }
}
