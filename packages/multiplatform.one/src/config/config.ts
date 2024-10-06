/*
 * File: /src/config/config.ts
 * Project: multiplatform.one
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

import type { IConfig } from "./types";

export class Config implements IConfig {
  private _config: Record<string, string> = {};

  private _blacklist: Set<string> = new Set([]);

  private _lookupEnv(key: string): string | undefined {
    if (this._blacklist.has(key)) return undefined;
    return process?.env?.[key];
  }

  private _resolveConfig() {
    return Object.keys(this._config).reduce<Record<string, string>>(
      (config, key) => {
        const value = this._lookupEnv(key) || this._config[key];
        if (typeof value !== "undefined") config[key] = value;
        return config;
      },
      {},
    );
  }

  private _reduceConfig(config: Record<string, string | undefined> = {}) {
    return Object.entries(config).reduce<Record<string, string>>(
      (config, [key, value]: [string, string | undefined]) => {
        if (typeof value !== "undefined") config[key] = value.toString();
        return config;
      },
      {},
    );
  }

  constructor(config: Record<string, string | undefined> = {}) {
    let viteConfig: Record<string, string | undefined> = {};
    try {
      viteConfig = JSON.parse(import.meta.env.VITE_MP_CONFIG || "{}");
    } catch (err) { }
    this._config = {
      ...this._reduceConfig(typeof viteConfig === "object" ? viteConfig : {}),
      ...this._reduceConfig(config),
    };
  }

  get(): Record<string, string>;
  get(key: string): string | undefined;
  get(key: string, defaultValue: string): string;
  get(
    key?: string,
    defaultValue?: string,
  ): Record<string, string> | string | undefined {
    const config = this._resolveConfig();
    if (!key) return config;
    return config[key] || defaultValue;
  }

  set(key: string, value: string) {
    this._config[key] = value;
    return value;
  }

  add(value: Record<string, string>) {
    this._config = {
      ...this._config,
      ...value,
    };
    return this.get();
  }

  remove(key: string): string | undefined {
    const value = this.get(key);
    delete this._config[key];
    return value;
  }
}
