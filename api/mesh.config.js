/**
 * File: /mesh.config.js
 * Project: api
 * File Created: 28-12-2024 11:05:40
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

module.exports = {
  sources: [
    {
      name: "Api",
      handler: {
        graphql: {
          endpoint: "http://localhost:5001/graphql",
          subscriptionsEndpoint: "ws://localhost:5001/graphql",
          subscriptionsProtocol: "WS",
          operationHeaders: {
            Authorization: "{context.headers.Authorization}",
            Cookie: "{context.headers.Cookie}",
          },
        },
      },
      transforms: [
        {
          prefix: {
            mode: "wrap",
            value: "Api",
          },
        },
        {
          filterSchema: {
            mode: "wrap",
            filters: [],
          },
        },
      ],
    },
    {
      name: "Frappe",
      handler: {
        graphql: {
          endpoint: "http://frappe.localhost/api/method/graphql",
          subscriptionsEndpoint: "ws://frappe.localhost/api/method/graphql",
          subscriptionsProtocol: "WS",
          operationHeaders: {
            Authorization: "{context.headers.Authorization}",
            Cookie: "{context.headers.Cookie}",
          },
        },
      },
      transforms: [
        {
          prefix: {
            mode: "wrap",
            value: "Frappe",
          },
        },
        {
          filterSchema: {
            mode: "wrap",
            filters: ["Subscription.doc_events"],
          },
        },
      ],
    },
  ],
  additionalEnvelopPlugins: "./envelopPlugins.js",
  serve: {
    browser: false,
  },
  plugins: [
    {
      rateLimit: {
        config: [],
      },
    },
    {
      maxTokens: {
        n: 1000,
      },
    },
    {
      maxDepth: {
        n: 10,
      },
    },
    {
      blockFieldSuggestions: {},
    },
    {
      responseCache: {},
    },
  ],
};
