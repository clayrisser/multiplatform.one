/**
 * File: /src/meshConfig.ts
 * Project: utils
 * -----
 * BitSpur (c) Copyright 2021 - 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

export const meshConfig = {
  sources: [
    ...(process.env.MESH_API === "1"
      ? [
          {
            name: "Api",
            handler: {
              graphql: {
                endpoint: `http://localhost:${process.env.API_PORT}/graphql`,
                subscriptionsEndpoint: `ws://localhost:${process.env.API_PORT}/graphql`,
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
        ]
      : []),
    ...(process.env.MESH_FRAPPE === "1"
      ? [
          {
            name: "Frappe",
            handler: {
              graphql: {
                endpoint: `${process.env.FRAPPE_BASE_URL}/api/method/graphql`,
                subscriptionsEndpoint:
                  `${process.env.FRAPPE_BASE_URL}/api/method/graphql`.replace(
                    /^https?/,
                    "ws",
                  ),
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
        ]
      : []),
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
} as const;
