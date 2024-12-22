/*
 * File: /src/logger/index.electron.ts
 * Project: multiplatform.one
 * File Created: 22-12-2024 06:03:02
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

import { platform } from "../platform";
import { BaseLogger } from "./base";
import { IPCTransport } from "./transport/ipc";
import type { LogTransport } from "./transport/types";
import type { LoggerOptions } from "./types";

export class Logger extends BaseLogger {
  constructor(config: LoggerOptions | string = {}) {
    const metadata = {
      platform: platform.preciseName,
    };
    super({
      name: metadata.platform,
      ...(typeof config === "string" ? { name: config } : config),
      metadata,
    });
  }

  protected createTransport(): LogTransport | undefined {
    if (platform.isElectronRenderer) return new IPCTransport();
  }

  protected createChildLogger(childLogger: Logger): Logger {
    const child = new Logger({
      name: childLogger.settings.name,
      metadata: this.metadata,
    });
    return child;
  }
}

export const logger = new Logger();

export * from "./types";
export * from "./base";
