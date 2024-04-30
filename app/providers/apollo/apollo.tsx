/**
 * File: /providers/apollo/apollo.tsx
 * Project: app
 * File Created: 29-04-2024 19:54:28
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
import { MultiPlatform } from 'multiplatform.one';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { useKeycloak } from '@multiplatform.one/keycloak';

const uri = 'http://localhost:5001/graphql';

export interface ApolloProviderProps extends PropsWithChildren {}

export function GlobalApolloProvider({ children }: ApolloProviderProps) {
  const keycloak = useKeycloak();
  const client = useMemo(() => {
    const headers = { ...(keycloak ? { Authorization: `Bearer ${keycloak?.token}` } : {}) };
    const httpLink = new HttpLink({ uri, headers });
    const wsLink = new GraphQLWsLink(
      createClient({
        url: uri.replace(/^http/, 'ws'),
        connectionParams: { headers },
      }),
    );
    return new ApolloClient({
      link: MultiPlatform.isServer
        ? httpLink
        : split(
            ({ query }) => {
              const definition = getMainDefinition(query);
              return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
            },
            wsLink,
            httpLink,
          ),
      cache: new InMemoryCache(),
    });
  }, [keycloak?.authenticated]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
