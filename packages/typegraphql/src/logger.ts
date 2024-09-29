/*
 * File: /src/logger.ts
 * Project: @multiplatform.one/typegraphql
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

import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import { context, trace } from "@opentelemetry/api";
import chalk from "chalk";
import type { Colorette } from "colorette";
import httpStatus from "http-status";
import Pino, { destination, multistream } from "pino";
import type { Logger as PinoLogger } from "pino";
import type { Options as PinoHttpOptions } from "pino-http";
import pretty, { type PinoPretty } from "pino-pretty";
import type { AxiosLoggerOptions } from "./axios";
import type { Ctx } from "./types";
import { generateRequestId } from "./utils";

export const LOGGER = "LOGGER";
export const LOGGER_OPTIONS = "LOGGER_OPTIONS";

let _logger: PinoLogger | undefined;

export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";
export type PrettifierExtras<T = object> = { colors: Colorette } & T;

export class Logger {
  pino?: PinoLogger;

  constructor(
    private readonly options: LoggerOptions = {},
    private readonly ctx?: Ctx,
  ) {
    this.pino = createLogger(this.options);
  }

  trace(message: string | Record<string, any>, ...args: string[]) {
    this.pino?.trace(
      {
        ...(typeof message === "object" ? message : {}),
        id: this.ctx?.id,
        operationName: this.ctx?.params?.operationName,
        time: new Date(),
      },
      ...(typeof message !== "object" ? [[message, ...args].join(" ")] : []),
    );
  }

  debug(message: string | Record<string, any>, ...args: string[]) {
    this.pino?.debug(
      {
        ...(typeof message === "object" ? message : {}),
        id: this.ctx?.id,
        operationName: this.ctx?.params?.operationName,
        time: new Date(),
      },
      ...(typeof message !== "object" ? [[message, ...args].join(" ")] : []),
    );
  }

  info(message: string | Record<string, any>, ...args: string[]) {
    this.pino?.info(
      {
        ...(typeof message === "object" ? message : {}),
        id: this.ctx?.id,
        operationName: this.ctx?.params?.operationName,
        time: new Date(),
      },
      ...(typeof message !== "object" ? [[message, ...args].join(" ")] : []),
    );
  }

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
  warn(
    message: string | Record<string, any> | Error | unknown,
    error?: string | Error | unknown,
    ...args: string[]
  ) {
    const err = this.getError(message, error, ...args);
    return this.pino?.warn(err);
  }

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
  error(
    message: string | Record<string, any> | Error | unknown,
    error?: string | Error | unknown,
    ...args: string[]
  ) {
    const err = this.getError(message, error, ...args);
    return this.pino?.error(err);
  }

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
  fatal(
    message: string | Record<string, any> | Error | unknown,
    error?: string | Error | unknown,
    ...args: string[]
  ) {
    const err = this.getError(message, error, ...args);
    return this.pino?.fatal(err);
  }

  getError(
    message: string | Record<string, any> | Error | unknown,
    error?: string | Error | unknown,
    ...args: string[]
  ) {
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
    err.id = this.ctx?.id;
    err.operationName = this.ctx?.params?.operationName;
    err.time = new Date();
    return err;
  }
}

function createLogger(options: LoggerOptions) {
  if (_logger) return _logger;
  _logger = Pino(
    {
      level: options.level || "debug",
      mixin(obj: any, _level: number) {
        return obj;
      },
      formatters: {
        level(label: string) {
          return { level: label };
        },
        log(obj: Record<string, any>) {
          obj.trace_id = undefined;
          obj.span_id = undefined;
          if (obj.trace_flags) {
            obj.traceFlags = obj.trace_flags;
            obj.trace_flags = undefined;
          }
          const span = trace.getSpan(context.active());
          if (!span) return { ...obj };
          const { spanId, traceId } =
            trace.getSpan(context.active())?.spanContext() || {};
          return { ...obj, spanId, traceId };
        },
      },
    },
    multistream(
      [
        ...(!options.container || options.logFileName || options.pretty
          ? [
              {
                stream: createPrettyStream(options),
              },
              {
                level: "error" as const,
                stream: createPrettyStream(options, process.stderr),
              },
            ]
          : [
              {
                stream: process.stdout,
              },
              {
                level: "error" as const,
                stream: process.stderr,
              },
            ]),
        ...(options.logFileName
          ? [
              {
                stream: createSonicBoom(
                  path.resolve(process.cwd(), options.logFileName),
                ),
              },
              {
                level: "error" as const,
                stream: createSonicBoom(
                  path.resolve(process.cwd(), options.logFileName),
                ),
              },
            ]
          : []),
      ],
      {
        dedupe: true,
      },
    ),
  ) as PinoLogger;
  return _logger;
}

export function createPinoHttp(
  options: LoggerOptions,
): PinoHttpOptions<IncomingMessage, ServerResponse> {
  return {
    logger: createLogger(options),
    genReqId: generateRequestId,
    customProps(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
      const result = { id: req.id };
      if (options.httpMixin) return options.httpMixin(result, req, res);
      return result;
    },
  };
}

function createPrettyStream(
  options: LoggerOptions,
  destination: NodeJS.WritableStream = process.stdout,
) {
  return pretty({
    minimumLevel: "trace",
    colorize: true,
    sync: true,
    mkdir: true,
    ignore: [
      "span_id",
      "traceFlags",
      "trace_flags",
      "trace_id",
      ...(options.ignore ? options.ignore : []),
    ].join(","),
    destination,
    errorLikeObjectKeys: ["error", "err"],
    customPrettifiers: {
      time(
        data: string | object,
        _key: string,
        _log: object,
        _extras: PrettifierExtras<any>,
      ): string {
        if (!data) return data as string;
        if (typeof data !== "string" || data.split(".").length < 2) {
          const date = new Date();
          return colorTime(
            `${date.getHours().toLocaleString("en-US", { minimumIntegerDigits: 2 })}:${date
              .getMinutes()
              .toLocaleString("en-US", { minimumIntegerDigits: 2 })}:${date
              .getSeconds()
              .toLocaleString("en-US", { minimumIntegerDigits: 2 })}`,
            `.${date.getMilliseconds().toLocaleString("en-US", { minimumIntegerDigits: 3 })}`,
            options.color,
          );
        }
        const [time, milli] = data.split(".");
        return colorTime(time, milli, options.color);
      },
      req(
        data: string | object,
        _key: string,
        _log: object,
        _extras: PrettifierExtras<any>,
      ): string {
        if (!data) return data as string;
        const req = typeof data === "string" ? JSON.parse(data) : data;
        return req.method && req.url
          ? `${req.method} ${req.url}${req.id ? ` id=${req.id}` : ""}`
          : "";
      },
      res(
        data: string | object,
        _key: string,
        _log: object,
        _extras: PrettifierExtras<any>,
      ): string {
        if (!data) return data as string;
        const res = typeof data === "string" ? JSON.parse(data) : data;
        return res.statusCode
          ? `status=${formatStatus(res.statusCode, options.color)}`
          : "";
      },
      method(
        data: string | object,
        _key: string,
        _log: object,
        _extras: PrettifierExtras<any>,
      ): string {
        if (!data) return data as string;
        if (options.color) {
          return chalk.bold(chalk.gray(data.toString()));
        }
        return data.toString();
      },
      status(
        data: string | object,
        _key: string,
        _log: object,
        _extras: PrettifierExtras<any>,
      ): string {
        if (!data) return data as string;
        return formatStatus(data.toString(), options.color);
      },
      kind(
        data: string | object,
        _key: string,
        _log: object,
        _extras: PrettifierExtras<any>,
      ): string {
        if (!data) return data as string;
        if (options.color) {
          switch (data) {
            case "HTTP_REQUEST": {
              return chalk.underline(chalk.italic(data));
            }
            case "HTTP_RESPONSE": {
              return chalk.underline(chalk.bold(data));
            }
            case "HTTP_ERROR": {
              return chalk.redBright(chalk.underline(chalk.bold(data)));
            }
          }
        }
        return prettifierStr(data) as string;
      },
      ...Object.fromEntries(
        [
          "ctx",
          "id",
          "operationName",
          "spanId",
          "traceId",
          "url",
          ...(options.strings ? options.strings : []),
        ].map((key) => [key, prettifierStr]),
      ),
      ...(options.prettifiers ? options.prettifiers : {}),
    },
  });
}

function colorTime(time: string, milli: string, color = false) {
  if (!color) return `${time}.${milli}`;
  return chalk.bold(chalk.magentaBright(time)) + chalk.magenta(`.${milli}`);
}

function formatStatus(status: number | string, color = false) {
  const statusName = httpStatus[`${status}_NAME` as keyof typeof httpStatus];
  status = `${status}${statusName ? `:${statusName}` : ""}`;
  if (color) {
    switch (Number.parseInt(status[0], 10)) {
      case 2: {
        return chalk.greenBright(status);
      }
      case 3: {
        return chalk.greenBright(status);
      }
      case 4: {
        return chalk.yellowBright(status);
      }
      case 5: {
        return chalk.redBright(status);
      }
    }
  }
  return status;
}

function prettifierStr(data: string | object) {
  if (!data) return data;
  if (typeof data === "object") {
    try {
      return JSON.stringify(data);
    } catch (err) {}
  }
  return data.toString();
}

function createSonicBoom(dest: string) {
  return destination({ dest, append: true, sync: true });
}

export interface LoggerOptions {
  axios?: AxiosLoggerOptions | boolean;
  color?: boolean;
  container?: boolean;
  httpMixin?: (
    mergeObject: object,
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
  ) => object;
  ignore?: string[];
  level?: LogLevel;
  logFileName?: string;
  mixin?: (mergeObject: object, level: number) => object;
  prettifiers?: Record<string, (data: string | object) => string>;
  pretty?: boolean;
  strings?: string[];
}
