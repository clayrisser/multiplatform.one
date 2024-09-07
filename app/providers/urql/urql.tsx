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
    const uri = `${config.get("API_BASE_URL") || "http://localhost:5001"}/graphql`;

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
