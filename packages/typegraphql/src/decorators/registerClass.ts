/*
 *  File: /src/decorators/registerClass.ts
 *  Project: @multiplatform.one/typegraphql
 *  File Created: 12-01-2024 09:45:36
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
import type { ResolverData, NextFn, MiddlewareInterface } from 'type-graphql';
import { DecorateAll } from './decorateAll';
import { createMethodDecorator } from '../decorate';

export const RegisterClass = ((target: any): undefined | Function => {
  if (!target.prototype) return;
  return (
    DecorateAll(
      createMethodDecorator(
        class RegisterClassDecorator implements MiddlewareInterface<Ctx> {
          async use({ context: ctx }: ResolverData<Ctx>, next: NextFn) {
            if (!ctx.typegraphqlMeta) ctx.typegraphqlMeta = {};
            if (!ctx.typegraphqlMeta.resolvers) ctx.typegraphqlMeta.resolvers = {};
            ctx.typegraphqlMeta.resolvers[target.name] = {
              target,
              handlers: [],
            };
            return next();
          }
        },
      ),
    ) as ClassDecorator
  )(target) as undefined | Function;
}) as ClassDecorator;
