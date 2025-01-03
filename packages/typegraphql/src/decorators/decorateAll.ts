/*
 * File: /src/decorators/decorateAll.ts
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

export function DecorateAll(
  decorator: MethodDecorator,
  options: { exclude?: string[]; deep?: boolean } = {},
) {
  return ((
    target: Function,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (propertyKey && descriptor)
      return decorator(target, propertyKey, descriptor);
    let descriptors = Object.getOwnPropertyDescriptors(target.prototype);
    if (options.deep) {
      let base = Object.getPrototypeOf(target);
      while (base.prototype) {
        const baseDescriptors = Object.getOwnPropertyDescriptors(
          base.prototype,
        );
        descriptors = { ...baseDescriptors, ...descriptors };
        base = Object.getPrototypeOf(base);
      }
    }
    for (const [propName, descriptor] of Object.entries(descriptors)) {
      const isMethod =
        typeof descriptor.value === "function" && propName !== "constructor";
      if (options.exclude?.includes(propName)) continue;
      if (!isMethod) continue;
      decorator(target.prototype, propName, descriptor);
      Object.defineProperty(target.prototype, propName, descriptor);
    }
    return target;
  }) as ClassDecorator | MethodDecorator;
}
