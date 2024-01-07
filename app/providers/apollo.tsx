/**
 * File: /providers/apollo.tsx
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

import React from 'react';
import type { PropsWithChildren } from 'react';
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider as OriginalApolloProvider, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const uri = 'http://localhost:3000/graphql';
const websocket = false;
const httpLink = new HttpLink({ uri });

const client = new ApolloClient({
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

export interface ApolloProviderProps extends PropsWithChildren {}

export function ApolloProvider({ children }: ApolloProviderProps) {
  return <OriginalApolloProvider client={client}>{children}</OriginalApolloProvider>;
}
