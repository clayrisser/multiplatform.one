/*
 * File: /src/logger/index.ts
 * Project: multiplatform.one
 * File Created: 22-12-2024 06:02:52
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

import type { ILogObj } from "tslog";
import type { Logger as TsLogger } from "tslog";
import { BaseLogger } from "./base";
import type { Logger, LoggerOptions } from "./types";

export class DefaultLogger extends BaseLogger {
  protected createChildLogger(childLogger: TsLogger<ILogObj>): Logger {
    const child = new DefaultLogger();
    child.tsLogger = childLogger;
    return child;
  }
}

// Create and export a default logger instance
export const logger = new DefaultLogger({
  name: "default",
  type: "pretty",
  minLevel: process.env.NODE_ENV === "development" ? 0 : 3,
});

export * from "./types";
export * from "./base";
