/**
 * File: /providers/urql/urql.tsx
 * Project: app
 * File Created: 21-06-2024 13:23:51
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

import { useKeycloak } from "@multiplatform.one/keycloak";
import { config } from "app/config";
import { createClient as createWSClient } from "graphql-ws";
import { MultiPlatform } from "multiplatform.one";
import React, { useMemo } from "react";
import type { PropsWithChildren } from "react";
import {
  Client,
  Provider as UrqlProvider,
  cacheExchange,
  fetchExchange,
  ssrExchange,
  subscriptionExchange,
} from "urql";

export interface GlobalUrqlProviderProps extends PropsWithChildren {
  keycloakDisabled?: boolean;
}
export function GlobalUrqlProvider({ children }: GlobalUrqlProviderProps) {
  const keycloak = useKeycloak();
  const client = useMemo(() => {
    const headers = {
      ...(keycloak ? { Authorization: `Bearer ${keycloak?.token}` } : {}),
    };
    const uri = `${config.get("BASE_URL", "http://app.localhost:8888")}/api/graphql`;
    const wsClient = createWSClient({
      url: uri.replace(/^http/, "ws"),
      connectionParams: { headers },
    });
    return new Client({
      url: uri,
      exchanges: !MultiPlatform.isServer
        ? [
            cacheExchange,
            fetchExchange,
            subscriptionExchange({
              forwardSubscription(request) {
                const input = { ...request, query: request.query || "" };
                return {
                  subscribe(sink) {
                    const unsubscribe = wsClient.subscribe(input, sink);
                    return { unsubscribe };
                  },
                };
              },
            }),
          ]
        : [],
    });
  }, [keycloak?.authenticated]);

  return <UrqlProvider value={client}>{children}</UrqlProvider>;
}
