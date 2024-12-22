/**
 * File: /src/logger/types.ts
 * Project: multiplatform.one
 * File Created: 22-12-2024 06:00:45
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

import type { ILogObj, ISettingsParam } from "tslog";

export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export interface LogMessage {
  level: LogLevel;
  args: unknown[];
  timestamp: string;
  source?: string;
}

export interface Logger {
  trace(message: string | Record<string, any>, ...args: string[]): void;
  debug(message: string | Record<string, any>, ...args: string[]): void;
  info(message: string | Record<string, any>, ...args: string[]): void;
  warn(
    message: Record<string, any>,
    error?: string | Error | unknown,
    ...args: string[]
  ): void;
  warn(
    message: string | Error | unknown,
    error?: string,
    ...args: string[]
  ): void;
  error(
    message: Record<string, any>,
    error?: string | Error | unknown,
    ...args: string[]
  ): void;
  error(
    message: string | Error | unknown,
    error?: string,
    ...args: string[]
  ): void;
  fatal(
    message: Record<string, any>,
    error?: string | Error | unknown,
    ...args: string[]
  ): void;
  fatal(
    message: string | Error | unknown,
    error?: string,
    ...args: string[]
  ): void;
  log(message: string | Record<string, any>, ...args: string[]): void;
  child(options: LoggerOptions): Logger;
  getSubLogger(options: LoggerOptions): Logger;
}

export type LoggerOptions = ISettingsParam<ILogObj>;
