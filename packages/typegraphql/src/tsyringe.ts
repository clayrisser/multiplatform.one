/*
 * File: /src/tsyringe.ts
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

import { Lifecycle, injectable, scoped, singleton } from 'tsyringe';
import { applyClassDecorators } from './decorate';

export function Injectable(lifecycle = Lifecycle.ContainerScoped) {
  let scope = scoped(lifecycle as Lifecycle.ContainerScoped | Lifecycle.ResolutionScoped) as ClassDecorator;
  if (lifecycle === Lifecycle.Singleton) scope = singleton() as ClassDecorator;
  return applyClassDecorators(injectable() as ClassDecorator, scope);
}

export { inject as Inject } from 'tsyringe';
