/*
 *  File: /src/modules/core/exception/error.interceptor.ts
 *  Project: api
 *  File Created: 16-10-2023 07:16:48
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2023
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

import httpStatus from 'http-status';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private logger = new Logger('ErrorInterceptor');

  constructor(private readonly config: ConfigService) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: Error) => {
        let httpException = err as HttpException;
        if (!(err instanceof HttpException)) {
          const axiosError =
            (err instanceof AxiosError && (err as AxiosError).response && (err as AxiosError)) || undefined;
          let statusCode = Number(
            axiosError?.response?.status || (err as any).statusCode || (err as any).code || (err as any).status,
          );
          if (statusCode >= 600 || statusCode < 100 || !Number.isFinite(statusCode)) {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          }
          httpException = new HttpException(
            {
              statusCode,
              message:
                extractAxiosErrorMessage(err) ||
                (err as any).messages ||
                err.message ||
                (this.config.get('DEBUG') === '1' ? err.toString() : 'Unknown error'),
              error: httpStatus[statusCode] || 'Internal Server Error',
            },
            statusCode,
          );
        }
        let statusCode = httpException.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
        if (statusCode >= 600 || statusCode < 100 || !Number.isFinite(statusCode)) statusCode = 500;
        const error = httpStatus[statusCode] || 'Internal Server Error';
        const response = httpException.getResponse();
        if (typeof response === 'object') {
          if (Array.isArray(response)) {
            const message = response.map((message) => message.toString());
            (httpException as any).response = {
              message: message.length === 1 ? message[0] : message,
              error,
            };
          } else {
            let message = (response as any).message;
            if (typeof message === 'undefined' || message === null) {
              message = error;
            } else if (Array.isArray(message)) {
              message = message.map((message) => message.toString());
            } else {
              message = message.toString();
            }
            (httpException as any).response = {
              ...response,
              message,
              error,
            };
          }
        } else {
          (httpException as any).response = {
            message: response.toString(),
            error,
          };
        }
        delete (httpException as any)?.response?.statusCode;
        if (statusCode >= 500) {
          this.logger.error(err);
        } else {
          this.logger.warn(err);
        }
        throw httpException;
      }),
    );
  }
}

function extractAxiosErrorMessage(err: Error) {
  if (!(err instanceof AxiosError)) return;
  const response = err.response;
  if (!response) return;
  let data = response.data;
  if (!data) return;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (err) {}
  }
  return data.message || JSON.stringify(response.data);
}
