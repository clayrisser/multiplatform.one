/**
 * File: /providers/apollo/apollo.native.tsx
 * Project: app
 * File Created: 29-04-2024 09:19:19
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
import type { GlobalApolloProviderProps } from './apollo';
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { config } from 'app/config';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { useKeycloak } from '@multiplatform.one/keycloak';

export function GlobalApolloProvider({ children, keycloakDisabled }: GlobalApolloProviderProps) {
  const keycloak = useKeycloak();
  const client = useMemo(() => {
    const headers = keycloakDisabled ? {} : { ...(keycloak ? { Authorization: `Bearer ${keycloak?.token}` } : {}) };
    const uri = (config.get('API_BASE_URL') || 'http://localhost:5001') + '/graphql';
    const httpLink = new HttpLink({ uri, headers });
    const wsLink = new GraphQLWsLink(
      createClient({
        url: uri.replace(/^http/, 'ws'),
        connectionParams: { headers },
      }),
    );
    const link = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      wsLink,
      httpLink,
    );
    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });
  }, [keycloak?.authenticated, keycloakDisabled]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
