/*
 *  File: /src/decorators/guards.ts
 *  Project: @multiplatform.one/keycloak-typegraphql
 *  File Created: 12-01-2024 08:16:15
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

import type { Ctx } from '../types';
import type { NextFn, ResolverData } from 'type-graphql';
import { DecorateAll } from './decorateAll';
import { RegisterClass } from './registerClass';
import { RegisterHandler } from './registerHandler';
import { applyClassDecorators } from '../decorate';
import { combineMiddlewares } from '../middleware';
import { createMethodDecorator } from 'type-graphql';

const Container = require('typedi').Container as typeof import('typedi').Container;

function GuardsDecorator(data: ResolverData<Ctx>, next: NextFn) {
  const { context: ctx } = data;
  if (!ctx.typegraphqlMeta?.deferredMiddlewares?.length) return next();
  return combineMiddlewares(ctx.typegraphqlMeta.deferredMiddlewares)(data, next);
}

Container.set(GuardsDecorator, GuardsDecorator);

export const Guards = applyClassDecorators(
  DecorateAll(createMethodDecorator(GuardsDecorator)),
  DecorateAll(RegisterHandler),
  RegisterClass,
);
