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

import type { Logger as TsLogger } from "tslog";
import type { ILogObj, ISettingsParam } from "tslog";
import { BaseLogger } from "./base";
import type { Logger, LoggerOptions } from "./types";

const LOG_CHANNEL = "electron-log";
const isMain = typeof process !== "undefined" && process?.type === "browser";
const isRenderer = typeof window !== "undefined";

interface LogMessage {
  logLevel?: string;
  argumentsArray?: unknown[];
}

type LogArg = string | Record<string, unknown>;

class RendererLogger extends BaseLogger {
  private ipcRenderer: any;

  constructor() {
    super({
      type: "pretty",
      prettyLogTemplate:
        "{{yyyy}}-{{mm}}-{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}} {{logLevelName}} [{{name}}]",
      prettyLogTimeZone: "local",
      name: "electron-renderer",
    });
    this.ipcRenderer = (window as any).electron?.ipcRenderer;
  }

  private log(level: string, ...args: unknown[]) {
    // Use the parent's tsLogger for browser console
    super[level as keyof BaseLogger]?.(...args);

    if (this.ipcRenderer) {
      this.ipcRenderer.send(LOG_CHANNEL, {
        logLevel: level,
        argumentsArray: args,
      });
    }
  }

  trace(...args: unknown[]) {
    this.log("trace", ...args);
  }
  debug(...args: unknown[]) {
    this.log("debug", ...args);
  }
  info(...args: unknown[]) {
    this.log("info", ...args);
  }
  warn(...args: unknown[]) {
    this.log("warn", ...args);
  }
  error(...args: unknown[]) {
    this.log("error", ...args);
  }
  fatal(...args: unknown[]) {
    this.log("fatal", ...args);
  }
}

export class ElectronLogger extends BaseLogger {
  private ipcInitialized = false;
  private rendererLogger: RendererLogger | null = null;

  constructor(options: LoggerOptions = {}) {
    super({
      ...options,
      type: options.type || "pretty",
      prettyLogTemplate:
        "{{yyyy}}-{{mm}}-{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}} {{logLevelName}} [{{name}}] ",
      prettyLogTimeZone: "local",
      prettyLogStyles: true,
    });
    this.initializeIpc();
  }

  private initializeIpc() {
    if (this.ipcInitialized) return;
    this.ipcInitialized = true;

    if (isMain) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { ipcMain } = require("electron");
        ipcMain?.on(LOG_CHANNEL, (_, logObject: LogMessage) => {
          const level = (logObject.logLevel?.toString() ||
            "info") as keyof Logger;
          const args = logObject.argumentsArray || [];
          if (args[0]) {
            const message = args[0] as LogArg;
            const logMessage =
              typeof message === "object" && message !== null
                ? { ...message, source: "renderer" }
                : String(message);
            const restArgs = args.slice(1).map(String);
            this[level](logMessage, ...(restArgs as [string, ...string[]]));
          }
        });
      } catch (error) {
        console.warn("Failed to set up IPC listener:", error);
      }
    } else if (isRenderer) {
      this.rendererLogger = new RendererLogger();
    }
  }

  protected createChildLogger(childLogger: TsLogger<ILogObj>): Logger {
    const child = new ElectronLogger();
    child.tsLogger = childLogger;
    return child;
  }

  public trace(message: LogArg, ...args: string[]) {
    if (isRenderer && this.rendererLogger) {
      this.rendererLogger.trace(message, ...args);
    } else if (isMain) {
      const logMessage =
        typeof message === "object" && message !== null
          ? { ...message, source: "main" }
          : String(message);
      super.trace(logMessage, ...args);
    }
  }

  public debug(message: LogArg, ...args: string[]) {
    if (isRenderer && this.rendererLogger) {
      this.rendererLogger.debug(message, ...args);
    } else if (isMain) {
      const logMessage =
        typeof message === "object" && message !== null
          ? { ...message, source: "main" }
          : String(message);
      super.debug(logMessage, ...args);
    }
  }

  public info(message: LogArg, ...args: string[]) {
    if (isRenderer && this.rendererLogger) {
      this.rendererLogger.info(message, ...args);
    } else if (isMain) {
      const logMessage =
        typeof message === "object" && message !== null
          ? { ...message, source: "main" }
          : String(message);
      super.info(logMessage, ...args);
    }
  }

  public warn(message: LogArg, ...args: string[]) {
    if (isRenderer && this.rendererLogger) {
      this.rendererLogger.warn(message, ...args);
    } else if (isMain) {
      const logMessage =
        typeof message === "object" && message !== null
          ? { ...message, source: "main" }
          : String(message);
      super.warn(logMessage, ...args);
    }
  }

  public error(message: LogArg, ...args: string[]) {
    if (isRenderer && this.rendererLogger) {
      this.rendererLogger.error(message, ...args);
    } else if (isMain) {
      const logMessage =
        typeof message === "object" && message !== null
          ? { ...message, source: "main" }
          : String(message);
      super.error(logMessage, ...args);
    }
  }

  public fatal(message: LogArg, ...args: string[]) {
    if (isRenderer && this.rendererLogger) {
      this.rendererLogger.fatal(message, ...args);
    } else if (isMain) {
      const logMessage =
        typeof message === "object" && message !== null
          ? { ...message, source: "main" }
          : String(message);
      super.fatal(logMessage, ...args);
    }
  }
}

// Create and export a single logger instance
export const logger = new ElectronLogger({
  name: "electron",
  type: "pretty",
  minLevel: 0,
  prettyLogTemplate:
    "{{yyyy}}-{{mm}}-{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}} {{logLevelName}} [{{name}}] ",
  prettyLogTimeZone: "local",
  prettyLogStyles: true,
});

export * from "./types";
export * from "./base";
