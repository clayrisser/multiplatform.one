/*
 *  File: /src/logger.ts
 *  Project: @multiplatform.one/nextjs-typegraphql
 *  File Created: 16-01-2024 03:23:43
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2024
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import Pino, { destination, multistream } from 'pino';
import chalk from 'chalk';
import httpStatus from 'http-status';
import path from 'path';
import pretty from 'pino-pretty';
import type { Ctx } from './types';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Logger as PinoLogger } from 'pino';
import { Options as PinoHttpOptions } from 'pino-http';
import { Token } from 'typedi';
import { generateRequestId, getReqHeader, setResHeader } from './utils';
import { randomUUID } from 'node:crypto';
import { trace, context } from '@opentelemetry/api';

export const LOGGER = new Token<Logger>('LOGGER');

let _logger: PinoLogger | undefined;

export class Logger {
  pino?: PinoLogger<any>;

  constructor(
    private readonly options: LoggerOptions = {},
    private readonly ctx?: Ctx,
  ) {
    this.pino = createLogger(this.options);
  }

  trace(message: string, ...args: any[]) {
    this.pino?.trace(
      {
        id: this.ctx?.id,
        operationName: this.ctx?.params?.operationName,
        time: new Date(),
      },
      message,
      ...args,
    );
  }

  debug(message: string, ...args: any[]) {
    this.pino?.debug(
      {
        id: this.ctx?.id,
        operationName: this.ctx?.params?.operationName,
        time: new Date(),
      },
      message,
      ...args,
    );
  }

  info(message: string, ...args: any[]) {
    this.pino?.info(
      {
        id: this.ctx?.id,
        operationName: this.ctx?.params?.operationName,
        time: new Date(),
      },
      message,
      ...args,
    );
  }

  warn(message: string | Error | unknown, ...args: any[]) {
    const err: Error & Record<string, any> = typeof message === 'string' ? new Error(message) : (message as Error);
    err.id = this.ctx?.id;
    err.operationName = this.ctx?.params?.operationName;
    err.time = new Date();
    return this.pino?.warn(err, ...args);
  }

  error(message: string | Error | unknown, ...args: any[]) {
    const err: Error & Record<string, any> = typeof message === 'string' ? new Error(message) : (message as Error);
    err.id = this.ctx?.id;
    err.operationName = this.ctx?.params?.operationName;
    err.time = new Date();
    return this.pino?.error(err, ...args);
  }

  fatal(message: string | Error | unknown, ...args: any[]) {
    const err: Error & Record<string, any> = typeof message === 'string' ? new Error(message) : (message as Error);
    err.id = this.ctx?.id;
    err.operationName = this.ctx?.params?.operationName;
    err.time = new Date();
    return this.pino?.fatal(err, ...args);
  }
}

export const LOGGER_OPTIONS = new Token<LoggerOptions>('LOGGER_OPTIONS');

function createLogger(options: LoggerOptions) {
  if (_logger) return _logger;
  _logger = Pino(
    {
      level: 'trace',
      mixin(obj: any, _level: number) {
        return obj;
      },
      formatters: {
        level(label: string) {
          return { level: label };
        },
        log(obj: Record<string, any>) {
          delete obj.trace_id;
          delete obj.span_id;
          if (obj.trace_flags) {
            obj.traceFlags = obj.trace_flags;
            delete obj.trace_flags;
          }
          const span = trace.getSpan(context.active());
          if (!span) return { ...obj };
          const { spanId, traceId } = trace.getSpan(context.active())?.spanContext() || {};
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
                level: 'error' as 'error',
                stream: createPrettyStream(options, process.stderr),
              },
            ]
          : [
              {
                stream: process.stdout,
              },
              {
                level: 'error' as 'error',
                stream: process.stderr,
              },
            ]),
        ...(options.logFileName
          ? [
              {
                stream: createSonicBoom(path.resolve(process.cwd(), options.logFileName)),
              },
              {
                level: 'error' as 'error',
                stream: createSonicBoom(path.resolve(process.cwd(), options.logFileName)),
              },
            ]
          : []),
      ],
      {
        levels: {
          silent: Infinity,
          fatal: 60,
          error: 50,
          warn: 50,
          info: 30,
          debug: 20,
          trace: 10,
        },
        dedupe: true,
      },
    ),
  ) as PinoLogger<any>;
  return _logger;
}

export function createPinoHttp(options: LoggerOptions): PinoHttpOptions<IncomingMessage, ServerResponse, any> {
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

function createPrettyStream(options: LoggerOptions, destination: NodeJS.WritableStream = process.stdout) {
  return pretty({
    minimumLevel: 'trace',
    colorize: true,
    sync: true,
    mkdir: true,
    ignore: ['span_id', 'traceFlags', 'trace_flags', 'trace_id', ...(options.ignore ? options.ignore : [])].join(','),
    destination,
    errorLikeObjectKeys: ['error', 'err'],
    customPrettifiers: {
      time(data: string | object) {
        if (!data) return data;
        if (typeof data !== 'string' || data.split('.').length < 2) {
          const date = new Date();
          return colorTime(
            `${date.getHours().toLocaleString('en-US', { minimumIntegerDigits: 2 })}:${date
              .getMinutes()
              .toLocaleString('en-US', { minimumIntegerDigits: 2 })}:${date
              .getSeconds()
              .toLocaleString('en-US', { minimumIntegerDigits: 2 })}`,
            `.${date.getMilliseconds().toLocaleString('en-US', { minimumIntegerDigits: 3 })}`,
            options.color,
          );
        }
        const [time, milli] = data.split('.');
        return colorTime(time, milli, options.color);
      },
      req(data: string | object) {
        if (!data) return data;
        const req = typeof data === 'string' ? JSON.parse(data) : data;
        return req.method && req.url ? `${req.method} ${req.url}${req.id ? ` id=${req.id}` : ''}` : '';
      },
      res(data: string | object) {
        if (!data) return data;
        const res = typeof data === 'string' ? JSON.parse(data) : data;
        return res.statusCode ? `status=${formatStatus(res.statusCode, options.color)}` : '';
      },
      method(data: string | object) {
        if (!data) return data;
        if (options.color) {
          return chalk.bold(chalk.gray(data.toString()));
        }
        return data.toString();
      },
      status(data: string | object) {
        if (!data) return data;
        return formatStatus(data.toString(), options.color);
      },
      kind(data: string | object) {
        if (!data) return data;
        if (options.color) {
          switch (data) {
            case 'HTTP_REQUEST': {
              return chalk.underline(chalk.italic(data));
            }
            case 'HTTP_RESPONSE': {
              return chalk.underline(chalk.bold(data));
            }
            case 'HTTP_ERROR': {
              return chalk.redBright(chalk.underline(chalk.bold(data)));
            }
          }
        }
        return prettifierStr(data);
      },
      ...Object.fromEntries(
        ['ctx', 'id', 'operationName', 'spanId', 'traceId', 'url', ...(options.strings ? options.strings : [])].map(
          (key) => [key, prettifierStr],
        ),
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
  const statusName = httpStatus[`${status}_NAME`];
  status = `${status}${statusName ? ':' + statusName : ''}`;
  if (color) {
    switch (parseInt(status[0], 10)) {
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
  if (typeof data === 'object') {
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
  color?: boolean;
  container?: boolean;
  httpMixin?: (mergeObject: object, req: IncomingMessage, res: ServerResponse<IncomingMessage>) => object;
  ignore?: string[];
  logFileName?: string;
  mixin?: (mergeObject: object, level: number) => object;
  prettifiers?: Record<string, (data: string | object) => string>;
  pretty?: boolean;
  strings?: string[];
}
