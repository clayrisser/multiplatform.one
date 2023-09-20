/*
 *  File: /src/bootstrap/miscellaneous.ts
 *  Project: api
 *  File Created: 19-09-2023 06:04:27
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

import type { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

export async function registerMiscellaneous(app: NestExpressApplication) {
  if (app.get(ConfigService).get('DEBUG') === '1') {
    // app.useGlobalFilters(new NestEnlighten({ theme: "theme-dark" }));
  }
}
