/*
 * File: /src/logger/types.ts
 * Project: multiplatform.one
 * File Created: 22-12-2024 06:02:42
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

import type { ILogObj, ILogObjMeta, ISettingsParam, Logger } from "tslog";
import type { PlatformName } from "../platform";

export type LogLevel =
  | "silly"
  | "trace"
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "fatal";

export enum LogSource {
  Main = "main",
  Renderer = "renderer",
  Default = "default",
}

export interface LogPayload {
  args?: unknown[];
  level: LogLevel;
  message: unknown;
  platform: PlatformName;
  timestamp: string;
}

export interface LoggerMetadata {
  platform?: PlatformName;
}

export interface LoggerOptions extends ISettingsParam<ILogObj> {
  metadata?: LoggerMetadata;
}

export type { ILogObj, ILogObjMeta };
export type TsLogger = Logger<ILogObj>;
