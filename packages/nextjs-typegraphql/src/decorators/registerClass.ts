/*
 *  File: /src/decorators/registerClass.ts
 *  Project: @multiplatform.one/nextjs-typegraphql
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
import type { ResolverData, NextFn } from 'type-graphql';
import { DecorateAll } from './decorateAll';
import { createMethodDecorator } from 'type-graphql';

const Container = require('typedi').Container as typeof import('typedi').Container;

export const RegisterClass = ((target: any): undefined | Function => {
  if (!target.prototype) return undefined;
  function RegisterClassDecorator({ context: ctx }: ResolverData<Ctx>, next: NextFn) {
    if (!ctx.typegraphqlMeta) ctx.typegraphqlMeta = {};
    ctx.typegraphqlMeta.getClass = () => target;
    return next();
  }
  Container.set(RegisterClassDecorator, RegisterClassDecorator);
  return DecorateAll(createMethodDecorator(RegisterClassDecorator))(target) as undefined | Function;
}) as ClassDecorator;
