/*
 *  File: /src/decorate.ts
 *  Project: @multiplatform.one/nextjs-typegraphql
 *  File Created: 12-01-2024 09:38:33
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

export type NestjsTypegraphqlNext = () => Promise<any>;

export function applyMethodDecorators(...decorators: Array<MethodDecorator>) {
  return ((target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    let result: any;
    for (const decorator of decorators) {
      result = decorator(target, propertyKey, descriptor);
    }
    return result;
  }) as MethodDecorator;
}

export function applyParamDecorators(...decorators: Array<ParameterDecorator>) {
  return ((target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    let result: any;
    for (const decorator of decorators) {
      result = decorator(target, propertyKey, parameterIndex);
    }
    return result;
  }) as ParameterDecorator;
}

export function applyPropertyDecorators(...decorators: Array<PropertyDecorator>) {
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
