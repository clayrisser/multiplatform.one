/**
 * File: /src/util.ts
 * Project: nestjs-keycloak
 * File Created: 15-07-2021 22:17:00
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 16-07-2021 19:00:00
 * Modified By: Clay Risser <email@clayrisser.com>
 * -----
 * Silicon Hills LLC (c) Copyright 2021
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

import { createMethodDecorator, NextFn, ResolverData } from 'type-graphql';
import { GraphqlCtx } from '../../types';

export function Resource(resource: string) {
  return createMethodDecorator(
    ({ context }: ResolverData<GraphqlCtx>, next: NextFn) => {
      if (!context.typegraphqlMeta) context.typegraphqlMeta = {};
      context.typegraphqlMeta.resource = resource;
      return next();
    }
  );
}
