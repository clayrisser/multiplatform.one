/*
 *  File: /src/decorators/registerHandler.ts
 *  Project: @multiplatform.one/nextjs-typegraphql
 *  File Created: 12-01-2024 09:46:44
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

import type { ResolverData, NextFn } from 'type-graphql';
import { createMethodDecorator } from 'type-graphql';
import { Ctx } from '../types';

const Container = require('typedi').Container as typeof import('typedi').Container;

export function RegisterHandler(
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<any>,
): undefined | TypedPropertyDescriptor<any> {
  if (target.prototype) return undefined;
  function RegisterHandlerDecorator({ context }: ResolverData<Ctx>, next: NextFn) {
    if (!context.typegraphqlMeta) context.typegraphqlMeta = {};
    context.typegraphqlMeta.getHandler = () => descriptor.value;
    return next();
  }
  Container.set(RegisterHandlerDecorator, RegisterHandlerDecorator);
  return createMethodDecorator(RegisterHandlerDecorator)(target, propertyKey, descriptor) as
    | undefined
    | TypedPropertyDescriptor<any>;
}
