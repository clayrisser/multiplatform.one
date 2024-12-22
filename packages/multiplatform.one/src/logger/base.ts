/*
 * File: /src/logger/base.ts
 * Project: multiplatform.one
 * File Created: 22-12-2024 07:17:28
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

import { Logger as TsLogger } from "tslog";
import type { ILogObj, ISettingsParam } from "tslog";
import type { LogLevel, LogMessage, Logger, LoggerOptions } from "./types";

export abstract class BaseLogger implements Logger {
  protected tsLogger: TsLogger<ILogObj>;

  constructor(options: LoggerOptions = {}) {
    const defaultSettings: ISettingsParam<ILogObj> = {
      type: "pretty",
      name: options.name || "default",
      prettyLogTemplate:
        "{{yyyy}}-{{mm}}-{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}} {{logLevelName}} [{{name}}] ",
      prettyLogTimeZone: "local",
      prettyLogStyles: true,
      minLevel: 0,
    };

    this.tsLogger = new TsLogger({
      ...defaultSettings,
      ...options,
    });
  }

  protected createLogMessage(level: LogLevel, args: unknown[]): LogMessage {
    return {
      level,
      args,
      timestamp: new Date().toISOString(),
      source: this.tsLogger.settings.name,
    };
  }

  protected getError(
    message: string | Record<string, any> | Error | unknown,
    error?: string | Error | unknown,
    ...args: string[]
  ): Error & Record<string, any> {
    let err: Error & Record<string, any> =
      typeof message !== "object"
        ? new Error([message, ...(error ? [error] : []), ...args].join(" "))
        : (message as Error);
    if (typeof err === "object" && !(err instanceof Error) && error) {
      if (typeof error !== "object")
        error = new Error([error, ...args].join(" "));
      Object.entries(err as Record<string, any>).forEach(([key, value]) => {
        (error as Record<string, any>)[key] = value;
      });
      err = error as Error & Record<string, any>;
    }
    err.time = new Date();
    return err;
  }

  public trace(message: string | Record<string, any>, ...args: string[]) {
    this.tsLogger.trace(
      {
        ...(typeof message === "object" ? message : {}),
        time: new Date(),
      },
      ...(typeof message !== "object" ? [[message, ...args].join(" ")] : []),
    );
  }

  public debug(message: string | Record<string, any>, ...args: string[]) {
    this.tsLogger.debug(
      {
        ...(typeof message === "object" ? message : {}),
        time: new Date(),
      },
      ...(typeof message !== "object" ? [[message, ...args].join(" ")] : []),
    );
  }

  public info(message: string | Record<string, any>, ...args: string[]) {
    this.tsLogger.info(
      {
        ...(typeof message === "object" ? message : {}),
        time: new Date(),
      },
      ...(typeof message !== "object" ? [[message, ...args].join(" ")] : []),
    );
  }

  public warn(
    message: Record<string, any>,
    error?: string | Error | unknown,
    ...args: string[]
  ): void;
  public warn(
    message: string | Error | unknown,
    error?: string,
    ...args: string[]
  ): void;
  public warn(
    message: string | Record<string, any> | Error | unknown,
    error?: string | Error | unknown,
    ...args: string[]
  ) {
    const err = this.getError(message, error, ...args);
    this.tsLogger.warn(err);
  }

  public error(
    message: Record<string, any>,
    error?: string | Error | unknown,
    ...args: string[]
  ): void;
  public error(
    message: string | Error | unknown,
    error?: string,
    ...args: string[]
  ): void;
  public error(
    message: string | Record<string, any> | Error | unknown,
    error?: string | Error | unknown,
    ...args: string[]
  ) {
    const err = this.getError(message, error, ...args);
    this.tsLogger.error(err);
  }

  public fatal(
    message: Record<string, any>,
    error?: string | Error | unknown,
    ...args: string[]
  ): void;
  public fatal(
    message: string | Error | unknown,
    error?: string,
    ...args: string[]
  ): void;
  public fatal(
    message: string | Record<string, any> | Error | unknown,
    error?: string | Error | unknown,
    ...args: string[]
  ) {
    const err = this.getError(message, error, ...args);
    this.tsLogger.fatal(err);
  }

  public log(message: string | Record<string, any>, ...args: string[]) {
    this.info(message, ...args);
  }

  public child(options: LoggerOptions): Logger {
    const childLogger = this.tsLogger.getSubLogger({
      ...options,
      type: options.type || this.tsLogger.settings.type,
      minLevel: options.minLevel ?? this.tsLogger.settings.minLevel,
    });
    return this.createChildLogger(childLogger);
  }

  public getSubLogger(options: LoggerOptions): Logger {
    return this.child(options);
  }

  protected abstract createChildLogger(childLogger: TsLogger<ILogObj>): Logger;
}
