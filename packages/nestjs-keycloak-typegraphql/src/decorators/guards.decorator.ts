/*
 *  File: /src/decorators/guards.decorator.ts
 *  Project: @multiplatform.one/nestjs-keycloak-typegraphql
 *  File Created: 19-09-2023 04:17:05
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

import RegisterClass from './registerClass.decorator';
import RegisterHandler from './registerHandler.decorator';
import type { GraphqlCtx } from '../types';
import type { NextFn, ResolverData } from 'type-graphql';
import { DecorateAll } from '@multiplatform.one/typegraphql-nestjs';
import { applyDecorators } from '@nestjs/common';
import { combineMiddlewares } from '../deferMiddleware';
import { createMethodDecorator } from 'type-graphql';

export default function Guards(): ClassDecorator {
  return applyDecorators(
    DecorateAll(
      createMethodDecorator((data: ResolverData<GraphqlCtx>, next: NextFn) => {
        const { context } = data;
        if (!context.typegraphqlMeta?.deferredMiddlewares?.length) {
          return next();
        }
        return combineMiddlewares(context.typegraphqlMeta.deferredMiddlewares)(data, next);
      }),
    ),
    DecorateAll(RegisterHandler),
    RegisterClass,
  );
}
