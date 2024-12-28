/**
 * File: /src/index.ts
 * Project: @multiplatform.one/envelop-multiplatform-plugin
 * File Created: 28-12-2024 07:34:16
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

import { useEngine } from "@envelop/core";
import { execute as graphqlExecute } from "graphql";
import { createClient } from "graphql-ws";
import type { Client } from "graphql-ws";
import WebSocket from "ws";
import type { MultiplatformPluginOptions } from "./types";

const logger = console;

function createSubscriptionIterator(
  client: Client,
  query: string,
  variables: Record<string, unknown>,
) {
  let unsubscribe: (() => void) | undefined;
  const queue: unknown[] = [];
  let waiting: ((result: IteratorResult<unknown>) => void) | undefined;
  let done = false;
  client.subscribe(
    {
      query,
      variables,
    },
    {
      next(data: unknown) {
        if (waiting) {
          const resolve = waiting;
          waiting = undefined;
          resolve({ value: data, done: false });
        } else {
          queue.push(data);
        }
      },
      error(err: Error) {
        logger.error(err);
        done = true;
        if (waiting) {
          const resolve = waiting;
          waiting = undefined;
          resolve({ value: undefined, done: true });
        }
      },
      complete() {
        done = true;
        if (waiting) {
          const resolve = waiting;
          waiting = undefined;
          resolve({ value: undefined, done: true });
        }
      },
    },
  );
  return {
    async next(): Promise<IteratorResult<unknown>> {
      if (done) return { value: undefined, done: true };
      if (queue.length > 0) {
        const value = queue.shift();
        return { value, done: false };
      }
      return new Promise((resolve) => {
        waiting = resolve;
      });
    },
    async return(): Promise<IteratorResult<unknown>> {
      done = true;
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = undefined;
      }
      return { value: undefined, done: true };
    },
  };
}

function defaultExecute({ contextValue, document, schema, variableValues }) {
  return graphqlExecute({
    schema,
    document,
    contextValue,
    variableValues,
  });
}

export default function multiplatformPlugin(
  options: MultiplatformPluginOptions = {},
) {
  const apiClient = options.apiUrl
    ? createClient({
        url: options.apiUrl,
        webSocketImpl: WebSocket,
        connectionParams: {
          headers: {},
        },
      })
    : undefined;
  const frappeClient = options.frappeUrl
    ? createClient({
        url: options.frappeUrl,
        webSocketImpl: WebSocket,
        connectionParams: {
          headers: {},
        },
      })
    : undefined;
  return useEngine({
    execute: ({
      contextValue,
      document,
      rootValue,
      schema,
      variableValues,
    }) => {
      const executor = rootValue?.execute || defaultExecute;
      return executor({
        contextValue,
        document,
        schema,
        variableValues,
      });
    },
    subscribe({ document, variableValues }) {
      const query = document?.loc?.source?.body;
      if (!query) throw new Error("No query provided");
      const isDocEvents = query.includes("doc_events");
      const client = isDocEvents ? frappeClient : apiClient;
      if (!client) {
        throw new Error(
          `missing url for ${isDocEvents ? "frappe" : "api"} client`,
        );
      }
      return {
        [Symbol.asyncIterator]() {
          return createSubscriptionIterator(client, query, variableValues);
        },
      };
    },
  });
}

export * from "./types";
