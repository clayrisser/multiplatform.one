/*
 * File: /__tests__/setup.ts
 * Project: api
 * File Created: 28-12-2024 21:00:00
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

import "reflect-metadata";
import { buildSchema } from "type-graphql";
import type { NonEmptyArray } from "type-graphql";
import { beforeAll } from "vitest";
import { options } from "../app";
import { resolvers } from "../resolvers";

// Initialize TypeGraphQL metadata
beforeAll(async () => {
  try {
    // First initialize the schema with the resolvers from options
    await buildSchema({
      ...options,
      resolvers: resolvers as NonEmptyArray<Function>,
      validate: false,
      skipCheck: true,
      emitSchemaFile: false,
    });
  } catch (error) {
    console.error("Error initializing schema:", error);
  }
});
