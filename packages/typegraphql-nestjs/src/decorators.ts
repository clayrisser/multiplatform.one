/*
 *  File: /src/decorators.ts
 *  Project: @multiplatform.one/typegraphql-nestjs
 *  File Created: 19-09-2023 07:20:04
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

import type { ResolverData } from 'type-graphql';
import { createParamDecorator as nestjsCreateParamDecorator } from '@nestjs/common';

let typeGraphqlCreateParamDecorator: any;
try {
  // eslint-disable-next-line global-require
  ({ typeGraphqlCreateParamDecorator } = require('type-graphql'));
} catch (err) {
  // void
}

export declare type CustomParamFactory<TData = any, TInput = any, TOutput = any, TContextType extends object = any> = (
  data?: TData,
  input?: TInput,
  resolverData?: ResolverData<TContextType>,
) => TOutput;

export function createParamDecorator<
  FactoryData = any,
  FactoryInput = any,
  FactoryOutput = any,
  TContextType extends object = any,
>(factory: CustomParamFactory<FactoryData, FactoryInput, FactoryOutput>) {
  const nestjsParamDecorator = nestjsCreateParamDecorator((data: FactoryData, input: FactoryInput) => {
    return factory(data, input);
  })();
  if (!typeGraphqlCreateParamDecorator) return nestjsParamDecorator;
  return applyParamDecorators(
    nestjsParamDecorator,
    typeGraphqlCreateParamDecorator((typeGraphqlResolverData: ResolverData<TContextType>) => {
      return factory(undefined, undefined, typeGraphqlResolverData);
    }),
  );
}

export function applyParamDecorators(...decorators: Array<ParameterDecorator>) {
  return ((target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    for (const decorator of decorators) {
      decorator(target, propertyKey, parameterIndex);
    }
  }) as ParameterDecorator;
}

export function DecorateAll(decorator: MethodDecorator, options: { exclude?: string[]; deep?: boolean } = {}) {
  return (target: any) => {
    let descriptors = Object.getOwnPropertyDescriptors(target.prototype);
    if (options.deep) {
      let base = Object.getPrototypeOf(target);
      while (base.prototype) {
        const baseDescriptors = Object.getOwnPropertyDescriptors(base.prototype);
        descriptors = { ...baseDescriptors, ...descriptors };
        base = Object.getPrototypeOf(base);
      }
    }
    for (const [propName, descriptor] of Object.entries(descriptors)) {
      const isMethod = typeof descriptor.value === 'function' && propName !== 'constructor';
      if (options.exclude?.includes(propName)) continue;
      if (!isMethod) continue;
      decorator(target.prototype, propName, descriptor);
      Object.defineProperty(target.prototype, propName, descriptor);
    }
  };
}
