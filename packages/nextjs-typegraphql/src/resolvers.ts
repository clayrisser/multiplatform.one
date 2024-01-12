/*
 *  File: /src/resolvers.ts
 *  Project: @multiplatform.one/nextjs-typegraphql
 *  File Created: 12-01-2024 12:55:41
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

import type { NonEmptyArray } from 'type-graphql';
import type { ServerOptions } from './types';
import { Guards } from './decorators/guards';

export function createResolvers(options: ServerOptions) {
  return options.resolvers.map((resolver) => {
    if (typeof resolver === 'string') return resolver;
    const decoratedResolver = Guards(resolver);
    (decoratedResolver as any).__typedi_container_id = resolver;
    return decoratedResolver;
  }) as NonEmptyArray<Function> | NonEmptyArray<string>;
}
