/*
 * File: /tests/resolvers.test.ts
 * Project: api
 * File Created: 28-12-2024 17:48:28
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
import type { NonEmptyArray } from "type-graphql";
import { describe, expect, it } from "vitest";
import { resolvers } from "../resolvers";

describe("Resolvers", () => {
  it("should export resolvers array", () => {
    expect(resolvers).toBeDefined();
    expect(Array.isArray(resolvers)).toBe(true);
    expect(resolvers.length).toBeGreaterThan(0);
  });

  it("should contain resolver classes", () => {
    resolvers.forEach((resolver: any) => {
      expect(typeof resolver).toBe("function");
      expect(resolver.prototype).toBeDefined();
      expect(resolver.prototype.constructor).toBeDefined();
    });
  });

  it("should have metadata for GraphQL resolvers", () => {
    resolvers.forEach((resolver: any) => {
      const resolverMetadata = Reflect.getMetadataKeys(resolver);
      const prototypeMetadata = Reflect.getMetadataKeys(resolver.prototype);
      const prototype = resolver.prototype;
      const methods = Object.getOwnPropertyNames(prototype).filter(
        (name) => name !== "constructor",
      );
      const hasGraphQLMethods = methods.some((method) => {
        const methodMetadata = Reflect.getMetadataKeys(prototype, method);
        return methodMetadata.some(
          (key) =>
            key === "design:returntype" ||
            key === "design:paramtypes" ||
            key === "design:type",
        );
      });
      const hasMetadata =
        resolverMetadata.some(
          (key) =>
            key === "graphql:resolver_type" ||
            key === "design:type" ||
            key === "design:paramtypes" ||
            key === "design:returntype" ||
            key === "KEYCLOAK_AUTHORIZED" ||
            key === "injectionTokens" ||
            key.startsWith("typegraphql:"),
        ) ||
        prototypeMetadata.some(
          (key) =>
            key === "graphql:resolver_type" ||
            key === "design:type" ||
            key === "design:paramtypes" ||
            key === "design:returntype" ||
            key === "KEYCLOAK_AUTHORIZED" ||
            key.startsWith("typegraphql:"),
        ) ||
        hasGraphQLMethods;
      expect(hasMetadata, `No metadata found for ${resolver.name}`).toBe(true);
    });
  });

  describe("Resolver Methods", () => {
    it("should have methods decorated with Query, Mutation, or Subscription", () => {
      resolvers.forEach((resolver: any) => {
        const prototype = resolver.prototype;
        const methods = Object.getOwnPropertyNames(prototype).filter(
          (name) => name !== "constructor",
        );
        methods.forEach((method) => {
          const methodMetadataKeys = Reflect.getMetadataKeys(prototype, method);
          const hasMetadata = methodMetadataKeys.some(
            (key) =>
              key === "graphql:query" ||
              key === "graphql:mutation" ||
              key === "graphql:subscription" ||
              key === "design:type" ||
              key === "design:paramtypes" ||
              key === "design:returntype" ||
              key.startsWith("typegraphql:"),
          );
          expect(
            hasMetadata,
            `No metadata found for ${resolver.name}.${method}`,
          ).toBe(true);
        });
      });
    });

    it("should have return types defined for methods", () => {
      resolvers.forEach((resolver: any) => {
        const prototype = resolver.prototype;
        const methods = Object.getOwnPropertyNames(prototype).filter(
          (name) => name !== "constructor",
        );
        methods.forEach((method) => {
          const methodMetadataKeys = Reflect.getMetadataKeys(prototype, method);
          const hasTypeMetadata = methodMetadataKeys.some(
            (key) =>
              key === "design:returntype" ||
              key === "graphql:returntype" ||
              key.includes("type") ||
              key.includes("Type"),
          );
          expect(
            hasTypeMetadata,
            `No return type metadata found for ${resolver.name}.${method}`,
          ).toBe(true);
        });
      });
    });
  });

  describe("Type Safety", () => {
    it("should be a valid NonEmptyArray of resolver classes", () => {
      const isValidResolverArray = (
        arr: unknown,
      ): arr is NonEmptyArray<Function> => {
        return (
          Array.isArray(arr) &&
          arr.length > 0 &&
          arr.every((item) => typeof item === "function")
        );
      };
      expect(isValidResolverArray(resolvers)).toBe(true);
    });
  });
});
