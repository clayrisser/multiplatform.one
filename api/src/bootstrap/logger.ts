/*
 *  File: /src/bootstrap/logger.ts
 *  Project: api
 *  File Created: 18-09-2023 08:18:09
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

import type { LogLevel } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Logger as PinoLogger } from 'nestjs-pino';

const { env } = process;

export async function registerLogger(app: NestExpressApplication) {
  app.useLogger(app.get(PinoLogger));
}

export let logLevels = (env.LOG_LEVELS || '').split(',') as LogLevel[];
if (!logLevels.length || !!Number(env.DEBUG)) {
  logLevels = ['error', 'warn', 'log', 'debug', 'verbose'];
}
