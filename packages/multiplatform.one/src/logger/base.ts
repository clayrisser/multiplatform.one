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

import type { ILogObj, ILogObjMeta, ISettingsParam } from "tslog";
import { Logger as TsLogger } from "tslog";
import { platform } from "../platform";
import type { LogTransport } from "./transport/types";
import type { LogLevel, LoggerMetadata, LoggerOptions } from "./types";

type LogResult = (ILogObj & ILogObjMeta) | undefined;

const logger = console;

export const defaultLoggerConfig: Omit<LoggerOptions, "metadata"> = {
  type: "pretty",
  prettyLogTemplate:
    "{{yyyy}}-{{mm}}-{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}} {{logLevelName}} [{{name}}] ",
  prettyLogTimeZone: "local",
  prettyLogStyles: {},
  minLevel: 0,
  hideLogPositionForProduction: true,
} as const;

export abstract class BaseLogger extends TsLogger<ILogObj> {
  private static readonly logLevels = [
    "silly",
    "trace",
    "debug",
    "info",
    "warn",
    "error",
    "fatal",
  ] as const satisfies readonly LogLevel[];

  protected transport?: LogTransport;
  protected metadata: LoggerMetadata;

  constructor(config: LoggerOptions | string = {}) {
    const { metadata, ...tslogConfig } =
      typeof config === "string" ? { name: config } : config;
    super({
      ...defaultLoggerConfig,
      prettyLogTemplate:
        platform.isWindowDefined || platform.isElectronRenderer
          ? "[{{name}}] "
          : "{{yyyy}}-{{mm}}-{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}} {{logLevelName}} [{{name}}] ",
      hideLogPositionForProduction: true,
      stylePrettyLogs: !(
        platform.isWindowDefined || platform.isElectronRenderer
      ),
      ...tslogConfig,
    });
    this.metadata = metadata || {};
    this.transport = this.createTransport?.();
  }

  protected createTransport?(): LogTransport | undefined;
  protected abstract createChildLogger(
    childLogger: TsLogger<ILogObj>,
  ): TsLogger<ILogObj>;

  public getSubLogger(
    settings: ISettingsParam<ILogObj> = {},
  ): TsLogger<ILogObj> {
    return this.createChildLogger(super.getSubLogger(settings));
  }

  protected logMessage(level: LogLevel, ...args: unknown[]): LogResult {
    let result: LogResult;
    if (platform.isWindowDefined || platform.isElectronRenderer) {
      switch (this.getConsoleMethod(level)) {
        case "trace":
          logger.trace(...args);
          break;
        case "debug":
          logger.debug(...args);
          break;
        case "info":
          logger.info(...args);
          break;
        case "warn":
          logger.warn(...args);
          break;
        case "error":
          logger.error(...args);
          break;
        default:
          logger.log(...args);
      }
    } else {
      result = super[level](...args);
    }
    if (this.transport) {
      this.transport.send({
        level,
        message: args[0],
        args: args.slice(1),
        platform: platform.preciseName,
        timestamp: new Date().toISOString(),
      });
    }
    return result;
  }

  private getConsoleMethod(level: LogLevel): keyof Console {
    switch (level) {
      case "silly":
      case "trace":
        return "trace";
      case "debug":
        return "debug";
      case "info":
        return "info";
      case "warn":
        return "warn";
      case "error":
      case "fatal":
        return "error";
      default:
        return "log";
    }
  }

  private isLogLevel(value: string): value is LogLevel {
    return BaseLogger.logLevels.includes(value as LogLevel);
  }

  public silly(...args: unknown[]): LogResult {
    return this.logMessage("silly", ...args);
  }

  public trace(...args: unknown[]): LogResult {
    return this.logMessage("trace", ...args);
  }

  public debug(...args: unknown[]): LogResult {
    return this.logMessage("debug", ...args);
  }

  public info(...args: unknown[]): LogResult {
    return this.logMessage("info", ...args);
  }

  public warn(...args: unknown[]): LogResult {
    return this.logMessage("warn", ...args);
  }

  public error(...args: unknown[]): LogResult {
    return this.logMessage("error", ...args);
  }

  public fatal(...args: unknown[]): LogResult {
    return this.logMessage("fatal", ...args);
  }

  public log(...args: unknown[]): LogResult {
    const [first, ...rest] = args;
    const level =
      typeof first === "string" && this.isLogLevel(first) ? first : "info";
    const logArgs = level === first && args.length > 1 ? rest : args;
    return this.logMessage(level, ...logArgs);
  }
}
