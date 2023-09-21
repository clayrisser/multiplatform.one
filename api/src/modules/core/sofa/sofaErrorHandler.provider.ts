/*
 *  File: /src/modules/core/sofa/sofaErrorHandler.provider.ts
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

import { ErrorHandler } from '@multiplatform.one/sofa-api';
import { FactoryProvider } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Response } from 'fets';

const logger = new Logger('SofaErrorHandler');

export const SOFA_ERROR_HANDLER = 'SOFA_ERROR_HANDLER';

export const SofaErrorHandlerProvider: FactoryProvider<ErrorHandler> = {
  provide: SOFA_ERROR_HANDLER,
  useFactory: () => {
    return (errs: ReadonlyArray<any>) => {
      (errs || []).forEach((err: any) => {
        logger.error(new Error(err));
      });
      return new Response(
        JSON.stringify({
          error: errs[0],
          status: 500,
          statusMessage: '',
          type: 'error' as 'error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    };
  },
};
