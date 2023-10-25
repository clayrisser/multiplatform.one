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

import type { CallHandler, ExecutionContext as NestjsExecutionContext } from '@nestjs/common';
import type { NextFn as ResolverNextFn, ResolverData } from 'type-graphql';
import { createParamDecorator as nestjsCreateParamDecorator, UseInterceptors } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import type {
  createMethodDecorator as TTypeGraphqlCreateMethodDecorator,
  createParamDecorator as TTypeGraphqlCreateParamDecorator,
} from 'type-graphql';

let typeGraphqlCreateMethodDecorator: typeof TTypeGraphqlCreateMethodDecorator | undefined;
let typeGraphqlCreateParamDecorator: typeof TTypeGraphqlCreateParamDecorator | undefined;
try {
  typeGraphqlCreateMethodDecorator = require('type-graphql').createMethodDecorator;
  typeGraphqlCreateParamDecorator = require('type-graphql').createParamDecorator;
} catch (err) {
  // void
}

export declare type CustomParamFactory<TData = any, TInput = any, TOutput = any, TContextType extends object = any> = (
  data?: TData,
  input?: TInput,
  resolverData?: ResolverData<TContextType>,
) => TOutput;

export declare type CustomMethodFactory<TResolverContext extends object = object> = (
  next: NestjsTypegraphqlNext,
  nestjsContext?: NestjsExecutionContext,
  resolverAction?: ResolverData<TResolverContext>,
) => Promise<any>;

export type NestjsTypegraphqlNext = () => Promise<any>;

export function createParamDecorator<
  FactoryData = any,
  FactoryInput = any,
  FactoryOutput = any,
  TResolverContext extends object = object,
>(factory: CustomParamFactory<FactoryData, FactoryInput, FactoryOutput>) {
  const nestjsParamDecorator = nestjsCreateParamDecorator((data: FactoryData, input: FactoryInput) => {
    return factory(data, input);
  })();
  if (!typeGraphqlCreateParamDecorator) return nestjsParamDecorator;
  typeGraphqlCreateParamDecorator((typeGraphqlResolverData: ResolverData<TResolverContext>) => {
    return factory(undefined, undefined, typeGraphqlResolverData);
  });
  return applyParamDecorators(
    nestjsParamDecorator,
    typeGraphqlCreateParamDecorator((typeGraphqlResolverData: ResolverData<TResolverContext>) => {
      return factory(undefined, undefined, typeGraphqlResolverData);
    }) as ParameterDecorator,
  );
}

export function createMethodDecorator<TContext extends object = object>(factory: CustomMethodFactory<TContext>) {
  const nestjsMethodDecorator = UseInterceptors((nestjsContext: NestjsExecutionContext, next: CallHandler) => {
    return factory(createNext(next), nestjsContext);
  });
  if (!typeGraphqlCreateMethodDecorator) return nestjsMethodDecorator;
  return applyMethodDecorators(
    nestjsMethodDecorator,
    typeGraphqlCreateMethodDecorator((typeGraphqlResolverData: ResolverData<TContext>, next: ResolverNextFn) => {
      return factory(createNext(undefined, next), undefined, typeGraphqlResolverData);
    }),
  );
}

export function applyMethodDecorators(...decorators: Array<MethodDecorator>) {
  return ((target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    for (const decorator of decorators) {
      decorator(target, propertyKey, descriptor);
    }
  }) as MethodDecorator;
}

export function applyParamDecorators(...decorators: Array<ParameterDecorator>) {
  return ((target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    for (const decorator of decorators) {
      decorator(target, propertyKey, parameterIndex);
    }
  }) as ParameterDecorator;
}

export function applyPropertyDecorators(...decorators: Array<PropertyDecorator>) {
  return ((target: Object, propertyKey: string | symbol) => {
    for (const decorator of decorators) {
      decorator(target, propertyKey);
    }
  }) as PropertyDecorator;
}

export function applyClassDecorators(...decorators: Array<ClassDecorator>) {
  return ((target: Function) => {
    for (const decorator of decorators) {
      decorator(target);
    }
  }) as ClassDecorator;
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

function createNext<TCallHandler = any>(nestjsNext?: CallHandler<TCallHandler>, resolverNext?: ResolverNextFn) {
  return () => {
    if (nestjsNext) {
      return firstValueFrom(nestjsNext.handle());
    } else if (resolverNext) {
      return resolverNext();
    }
    return Promise.resolve();
  };
}
