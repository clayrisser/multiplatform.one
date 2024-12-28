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
import { createClient } from "graphql-ws";
import WebSocket from "ws";
import type { MultiplatformPluginOptions } from "./types";

function createSubscriptionIterator(
  client: any,
  query: string,
  variables: any,
) {
  let unsubscribe: (() => void) | null;
  const queue: any[] = [];
  let waiting: ((result: any) => void) | null = null;
  let done = false;

  client.subscribe(
    {
      query,
      variables,
    },
    {
      next: (data: any) => {
        if (waiting) {
          const resolve = waiting;
          waiting = null;
          resolve({ value: data, done: false });
        } else {
          queue.push(data);
        }
      },
      error: (error: Error) => {
        console.error("Subscription error:", error);
        done = true;
        if (waiting) {
          const resolve = waiting;
          waiting = null;
          resolve({ done: true });
        }
      },
      complete: () => {
        done = true;
        if (waiting) {
          const resolve = waiting;
          waiting = null;
          resolve({ done: true });
        }
      },
    },
  );

  return {
    async next() {
      if (done) return { done: true };
      if (queue.length > 0) {
        const value = queue.shift();
        return { value, done: false };
      }
      return new Promise((resolve) => {
        waiting = resolve;
      });
    },
    async return() {
      done = true;
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
      return { done: true };
    },
  };
}

export default function multiplatformPlugin(
  options: MultiplatformPluginOptions = {},
) {
  const apiClient = createClient({
    url: options.apiUrl || "ws://localhost:5001/graphql",
    webSocketImpl: WebSocket,
    connectionParams: {
      headers: {},
    },
  });

  const frappeClient = createClient({
    url: options.frappeUrl || "ws://frappe.localhost/api/method/graphql",
    webSocketImpl: WebSocket,
    connectionParams: {
      headers: {},
    },
  });

  return useEngine({
    execute: ({
      schema,
      document,
      contextValue,
      variableValues,
      rootValue,
    }) => {
      console.log("🎯 Execute:", {
        operation: document?.definitions[0]?.operation,
        query: document?.loc?.source?.body,
      });
      return rootValue.execute({
        schema,
        document,
        contextValue,
        variableValues,
      });
    },
    subscribe: ({ document, variableValues }) => {
      const query = document?.loc?.source?.body;
      if (!query) throw new Error("No query provided");

      // Check if this is a doc_events subscription
      const isDocEvents = query.includes("doc_events");
      console.log("🎯 Subscribe:", {
        operation: document?.definitions[0]?.operation,
        query,
        isDocEvents,
      });

      return {
        [Symbol.asyncIterator]() {
          // Route to appropriate client based on the subscription type
          const client = isDocEvents ? frappeClient : apiClient;
          return createSubscriptionIterator(client, query, variableValues);
        },
      };
    },
  });
}

export * from "./types";
