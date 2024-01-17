/**
 * File: /providers/apollo/apollo.tsx
 * Project: app
 * File Created: 07-01-2024 10:15:59
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
