import React, { useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { useKeycloak } from '@multiplatform.one/keycloak';

const uri = 'http://localhost:5001/graphql';
const websocket = false;

export interface ApolloProviderProps extends PropsWithChildren {}

export function GlobalApolloProvider({ children }: ApolloProviderProps) {
  const keycloak = useKeycloak();

  const client = useMemo(() => {
    const httpLink = new HttpLink({
      uri,
      headers: {
        ...(keycloak?.token && { authorization: `Bearer ${keycloak?.token}` }),
      },
    });
    return new ApolloClient({
      link: websocket
        ? split(
            ({ query }) => {
              const definition = getMainDefinition(query);
              return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
            },
            new WebSocketLink({
              uri: uri.replace(/^http/, 'ws'),
              options: {
                reconnect: true,
              },
            }),
            httpLink,
          )
        : httpLink,
      cache: new InMemoryCache(),
    });
  }, [keycloak?.token]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
