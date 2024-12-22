/*
 * File: /src/logger.ts
 * Project: @multiplatform.one/typegraphql
 * File Created: 19-11-2024 20:26:31
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

/**
 * File: /src/logger.ts
 * Project: @multiplatform.one/typegraphql
 * File Created: 22-12-2024 06:21:09
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

import { writeFileSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import {
  type Logger as BaseLogger,
  type LoggerOptions as BaseLoggerOptions,
  logger as baseLogger,
} from "multiplatform.one";
import type { ILogObj } from "tslog";
import { getOpenTelemetryContext } from "./logger/context";
import type { Ctx } from "./types";
import { generateRequestId } from "./utils";

export const LOGGER = "LOGGER";
export const LOGGER_OPTIONS = "LOGGER_OPTIONS";

let _logger: BaseLogger | undefined;

export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export interface LoggerOptions extends Omit<BaseLoggerOptions, "level"> {
  level?: LogLevel;
  pretty?: boolean;
  container?: boolean;
  logFileName?: string;
  axios?: boolean;
}

export class Logger {
  private logger?: BaseLogger;
  private readonly loggerContext: Record<string, any>;

  constructor(
    private readonly options: LoggerOptions = {},
    private readonly ctx?: Ctx,
  ) {
    this.logger = createLogger(this.options);
    this.loggerContext = {
      id: this.ctx?.id,
      operationName: this.ctx?.params?.operationName,
    };
  }

  private formatMessage(
    message: string | Record<string, any>,
    args: any[] = [],
  ): { context: Record<string, any>; message?: string } {
    const context = {
      ...this.loggerContext,
      ...(typeof message === "object" ? message : {}),
      time: new Date(),
    };
    return {
      context,
      message:
        typeof message !== "object" ? [message, ...args].join(" ") : undefined,
    };
  }

  trace(message: string | Record<string, any>, ...args: any[]) {
    const { context, message: msg } = this.formatMessage(message, args);
    this.logger?.trace(context, msg);
  }

  debug(message: string | Record<string, any>, ...args: any[]) {
    const { context, message: msg } = this.formatMessage(message, args);
    this.logger?.debug(context, msg);
  }

  info(message: string | Record<string, any>, ...args: any[]) {
    const { context, message: msg } = this.formatMessage(message, args);
    this.logger?.info(context, msg);
  }

  warn(
    message: Record<string, any>,
    error?: string | Error | unknown,
    ...args: any[]
  ): void;
  warn(message: string | Error | unknown, error?: string, ...args: any[]): void;
  warn(
    message: string | Record<string, any> | Error | unknown,
    error?: string | Error | unknown,
    ...args: any[]
  ) {
    const err = this.getError(message, error, ...args);
    this.logger?.warn(err);
  }

  error(
    message: Record<string, any>,
    error?: string | Error | unknown,
    ...args: any[]
  ): void;
  error(
    message: string | Error | unknown,
    error?: string,
    ...args: any[]
  ): void;
  error(
    message: string | Record<string, any> | Error | unknown,
    error?: string | Error | unknown,
    ...args: any[]
  ) {
    const err = this.getError(message, error, ...args);
    this.logger?.error(err);
  }

  fatal(
    message: Record<string, any>,
    error?: string | Error | unknown,
    ...args: any[]
  ): void;
  fatal(
    message: string | Error | unknown,
    error?: string,
    ...args: any[]
  ): void;
  fatal(
    message: string | Record<string, any> | Error | unknown,
    error?: string | Error | unknown,
    ...args: any[]
  ) {
    const err = this.getError(message, error, ...args);
    this.logger?.fatal(err);
  }

  private getError(
    message: string | Record<string, any> | Error | unknown,
    error?: string | Error | unknown,
    ...args: any[]
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
    return Object.assign({}, err, this.loggerContext, { time: new Date() });
  }
}

function createLogger(options: LoggerOptions): BaseLogger {
  if (_logger) return _logger;
  _logger = baseLogger.getSubLogger({
    name: "typegraphql",
    type: options.pretty ? "pretty" : "json",
    prettyLogTemplate:
      "{{yyyy}}-{{mm}}-{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}} {{logLevelName}} [{{name}}] ",
    minLevel: (options.level || "debug") as any,
    attachedTransports: [
      (logObject: ILogObj) => {
        const telemetryContext = getOpenTelemetryContext();
        if (Object.keys(telemetryContext).length) {
          logObject.context = {
            ...(logObject.context as Record<string, unknown>),
            ...telemetryContext,
          };
        }
        if (options.logFileName) {
          writeFileSync(
            path.resolve(process.cwd(), options.logFileName),
            `${JSON.stringify(logObject)}\n`,
            { flag: "a" },
          );
        }
      },
    ],
    ...options,
  });
  return _logger;
}

export interface HttpLoggerOptions extends LoggerOptions {
  customProps?: (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
  ) => Record<string, any>;
}

export function createHttpLogger(options: HttpLoggerOptions = {}) {
  const logger = createLogger(options);
  return {
    logger,
    genReqId: generateRequestId,
    customProps:
      options.customProps ||
      ((req: IncomingMessage, _res: ServerResponse<IncomingMessage>) => ({
        httpVersion: req.httpVersion,
        method: req.method,
        remoteAddress: req.socket.remoteAddress,
        url: req.url,
      })),
  };
}
