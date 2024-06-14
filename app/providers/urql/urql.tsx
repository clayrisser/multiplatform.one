import React, { useMemo } from 'react';
import { useKeycloak } from '@multiplatform.one/keycloak';
import type { PropsWithChildren } from 'react';
import { config } from 'app/config';
import {
  Client,
  cacheExchange,
  fetchExchange,
  subscriptionExchange,
  Provider as UrqlProvider,
  ssrExchange,
} from 'urql';
import { createClient as createWSClient } from 'graphql-ws';
import { MultiPlatform } from 'multiplatform.one';

export interface GlobalUrqlProviderProps extends PropsWithChildren {
  keycloakDisabled?: boolean;
}
export function GlobalUrqlProvider({ children }: GlobalUrqlProviderProps) {
  const keycloak = useKeycloak();
  const client = useMemo(() => {
    const headers = { ...(keycloak ? { Authorization: `Bearer ${keycloak?.token}` } : {}) };
    const uri = (config.get('API_BASE_URL') || 'http://localhost:5001') + '/graphql';

    const wsClient = createWSClient({
      url: uri.replace(/^http/, 'ws'),
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
                const input = { ...request, query: request.query || '' };
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
