/*
 * File: /src/buildSchema.ts
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

import path from "node:path";
import {
  type BuildSchemaOptions,
  type ResolverData,
  buildSchema as typeGraphqlBuildSchema,
} from "type-graphql";
import type { ValidateSettings } from "type-graphql/build/typings/schema/build-context";
import { createResolvers } from "./resolvers";
import type { AppOptions, Ctx } from "./types";

const logger = console;

export async function _buildSchemaBin() {
  const bundlePath = process.argv[2];
  const emitPath =
    process.argv.length > 3
      ? path.resolve(process.cwd(), process.argv[3])
      : undefined;
  if (!bundlePath || !emitPath) {
    if (!bundlePath) logger.error("missing bundle path");
    if (!emitPath) logger.error("missing emit path");
    process.exit(1);
  }
  const { options } = await import(path.resolve(process.cwd(), bundlePath));
  await buildSchema(options, emitPath);
  logger.info(`schema emitted to ${emitPath}`);
}

export async function buildSchema(options: AppOptions, emit?: string | true) {
  return typeGraphqlBuildSchema({
    ...createBuildSchemaOptions(options),
    emitSchemaFile:
      emit === true ? path.resolve(process.cwd(), "schema.graphql") : emit,
  });
}

export function createBuildSchemaOptions(options: AppOptions) {
  const validate: ValidateSettings = {
    forbidUnknownValues: false,
  };
  const buildSchemaOptions = {
    ...options.buildSchema,
    container: ({ context: ctx }: ResolverData<Ctx>) => ({
      get: (resolver) => ctx.container.resolve(resolver),
    }),
    pubSub: options.pubSub,
    resolvers: createResolvers(options),
    validate:
      typeof options.buildSchema?.validate === "object"
        ? {
            ...validate,
            ...options.buildSchema?.validate,
          }
        : validate,
  } as BuildSchemaOptions;
  options.addons?.forEach((addon) => {
    if (addon.register) {
      const addonResult = addon.register(options);
      if (addonResult.buildSchemaOptions.globalMiddlewares) {
        buildSchemaOptions.globalMiddlewares = [
          ...(buildSchemaOptions.globalMiddlewares || []),
          ...addonResult.buildSchemaOptions.globalMiddlewares,
        ];
      }
    }
  });
  return buildSchemaOptions;
}
