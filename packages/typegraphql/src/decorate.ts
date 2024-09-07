/*
 * File: /src/decorate.ts
 * Project: @multiplatform.one/typegraphql
 * File Created: 04-04-2024 15:50:39
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { container as Container, Lifecycle, container } from "tsyringe";
import type { MiddlewareFn } from "type-graphql";
import { createMethodDecorator as typeGraphqlCreateMethodDecorator } from "type-graphql";
import type { Ctx, ReflectableDecorator, Type } from "./types";

export function applyMethodDecorators(...decorators: Array<MethodDecorator>) {
  return ((
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    let result: any;
    for (const decorator of decorators) {
      result = decorator(target, propertyKey, descriptor);
    }
    return result;
  }) as MethodDecorator;
}

export function applyParamDecorators(...decorators: Array<ParameterDecorator>) {
  return ((
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) => {
    let result: any;
    for (const decorator of decorators) {
      result = decorator(target, propertyKey, parameterIndex);
    }
    return result;
  }) as ParameterDecorator;
}

export function applyPropertyDecorators(
  ...decorators: Array<PropertyDecorator>
) {
  return ((target: Object, propertyKey: string | symbol) => {
    let result: any;
    for (const decorator of decorators) {
      result = decorator(target, propertyKey);
    }
    return result;
  }) as PropertyDecorator;
}

export function applyClassDecorators(...decorators: Array<ClassDecorator>) {
  return ((target: Function) => {
    let result: any;
    for (const decorator of decorators) {
      result = decorator(target);
    }
    return result;
  }) as ClassDecorator;
}

export function createMethodDecorator<C extends Ctx = Ctx>(
  resolver: any,
  _container = Container,
): MethodDecorator {
  container.register(
    resolver,
    { useClass: resolver },
    { lifecycle: Lifecycle.ContainerScoped },
  );
  return typeGraphqlCreateMethodDecorator<C>(
    resolver as any as MiddlewareFn<C>,
  );
}

export function getMetadata<TResult = any, TKey = any>(
  metadataKeyOrDecorator: TKey,
  target: Type<any> | Function,
): TResult | undefined {
  const metadataKey =
    (metadataKeyOrDecorator as ReflectableDecorator<unknown>).KEY ??
    metadataKeyOrDecorator;
  return Reflect.getMetadata(metadataKey, target);
}
