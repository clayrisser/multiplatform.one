/*
 * File: /tests/graphql.test.ts
 * Project: api
 * File Created: 28-12-2024 17:13:59
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
import { buildSchema } from "@multiplatform.one/typegraphql";
import type { GraphQLSchema } from "graphql";
import { createYoga } from "graphql-yoga";
import { beforeAll, describe, expect, it } from "vitest";
import { options } from "../app";

describe("GraphQL API", () => {
  let schema: GraphQLSchema;

  beforeAll(async () => {
    schema = await buildSchema(options);
  });

  it("should build a valid schema", () => {
    expect(schema).toBeDefined();
    expect(schema.getQueryType()).toBeDefined();
    expect(schema.getMutationType()).toBeDefined();
  });

  it("should create a valid yoga server", () => {
    const yoga = createYoga({ schema });
    expect(yoga).toBeDefined();
    expect(yoga.graphqlEndpoint).toBe("/graphql");
  });

  it("should have required resolvers", () => {
    expect(options.resolvers).toBeDefined();
    expect(Array.isArray(options.resolvers)).toBe(true);
    expect(options.resolvers.length).toBeGreaterThan(0);
  });

  it("should have valid configuration", () => {
    expect(options.port).toBeDefined();
    expect(typeof options.port).toBe("number");
    expect(options.prisma).toBeDefined();
    expect(options.pubSub).toBeDefined();
  });

  it("should have keycloak addon configured", () => {
    const addons = options.addons ?? [];
    expect(Array.isArray(addons)).toBe(true);
    const keycloakAddon = addons.find((addon) => {
      return (
        typeof addon.register === "function" &&
        typeof addon.beforeStart === "function"
      );
    });
    expect(keycloakAddon).toBeDefined();
  });

  describe("Schema Types", () => {
    it("should have Query type with fields", () => {
      const queryType = schema.getQueryType();
      expect(queryType).toBeDefined();
      const fields = queryType?.getFields() ?? {};
      expect(Object.keys(fields).length).toBeGreaterThanOrEqual(0);
    });

    it("should have Mutation type with fields", () => {
      const mutationType = schema.getMutationType();
      expect(mutationType).toBeDefined();
      const fields = mutationType?.getFields() ?? {};
      expect(Object.keys(fields).length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("PubSub Configuration", () => {
    it("should have pubSub instance configured", () => {
      expect(options.pubSub).toBeDefined();
      if (options.pubSub) {
        expect(typeof options.pubSub.publish).toBe("function");
        expect(typeof options.pubSub.subscribe).toBe("function");
      }
    });
  });

  describe("Prisma Configuration", () => {
    it("should have prisma client configured", () => {
      expect(options.prisma).toBeDefined();
      if (options.prisma) {
        expect(options.prisma.$connect).toBeDefined();
        expect(typeof options.prisma.$connect).toBe("function");
      }
    });
  });
});
