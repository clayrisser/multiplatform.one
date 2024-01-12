/*
 *  File: /src/buildSchema.ts
 *  Project: @multiplatform.one/nextjs-typegraphql
 *  File Created: 12-01-2024 05:17:13
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

import path from 'path';
import type { Ctx, ServerOptions } from './types';
import { BuildSchemaOptions, ResolverData, buildSchema as typeGraphqlBuildSchema } from 'type-graphql';
import { ValidateSettings } from 'type-graphql/dist/schema/build-context';

export async function buildSchema(options: ServerOptions, emit?: string | true) {
  return typeGraphqlBuildSchema({
    ...createBuildSchemaOptions(options),
    emitSchemaFile: emit === true ? path.resolve(process.cwd(), 'schema.graphql') : emit,
  });
}

export function createBuildSchemaOptions(options: ServerOptions) {
  const validate: ValidateSettings = {
    forbidUnknownValues: false,
  };
  return {
    ...options.buildSchema,
    resolvers: options.resolvers,
    container: ({ context: ctx }: ResolverData<Ctx>) => ctx.container,
    validate:
      typeof options.buildSchema?.validate === 'object'
        ? {
            ...validate,
            ...options.buildSchema?.validate,
          }
        : validate,
  } as BuildSchemaOptions;
}
