/*
 *  File: /src/types.ts
 *  Project: @multiplatform.one/nestjs-axios-logger
 *  File Created: 19-09-2023 05:24:50
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

import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { LogLevel } from '@nestjs/common';
import type { ModuleMetadata } from '@nestjs/common/interfaces';

export interface AxiosLoggerOptions {
  data?: boolean;
  error?: (err: AxiosError | string, options: AxiosLoggerOptions) => AxiosError | string;
  errorLogLevel?: LogLevel;
  headers?: boolean;
  kind?: boolean;
  method?: boolean;
  request?: (response: AxiosRequestConfig, options: AxiosLoggerOptions) => string;
  requestLogLevel?: LogLevel;
  response?: (response: AxiosResponse, options: AxiosLoggerOptions) => string;
  responseLogLevel?: LogLevel;
  secretMask?: boolean;
  status?: boolean;
  url?: boolean;
}

export interface AxiosLoggerAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: (...args: any[]) => Promise<AxiosLoggerOptions> | AxiosLoggerOptions;
}

export const AXIOS_LOGGER_OPTIONS = 'AXIOS_LOGGER_OPTIONS';
