import React, { useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const uri = 'http://localhost:5001/graphql';
const websocket = typeof window !== 'undefined';

export interface ApolloProviderProps extends PropsWithChildren {}

export function GlobalApolloProvider({ children }: ApolloProviderProps) {
  const client = useMemo(() => {
    const httpLink = new HttpLink({ uri });
    const wsLink = new GraphQLWsLink(
      createClient({
        url: uri.replace(/^http/, 'ws'),
      }),
    );
    return new ApolloClient({
      link: websocket
        ? split(
            ({ query }) => {
              const definition = getMainDefinition(query);
              return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
            },
            wsLink,
            httpLink,
          )
        : httpLink,
      cache: new InMemoryCache(),
    });
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
