/*
 *  File: /src/apollo.ts
 *  Project: @multiplatform.one/keycloak
 *  File Created: 13-01-2024 13:37:13
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2024
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { useKeycloak } from './keycloak';
import { useQuery as apolloUseQuery, useMutation as apolloUseMutation } from '@apollo/client';
import type {
  ApolloCache,
  DefaultContext,
  DocumentNode,
  MutationHookOptions,
  MutationTuple,
  NoInfer,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  TypedDocumentNode,
} from '@apollo/client';

export function useAuthQuery<TData = any, TVariables extends OperationVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>,
): QueryResult<TData, TVariables> {
  const keycloak = useKeycloak();
  return apolloUseQuery(query, {
    ...options,
    skip: options?.skip || !keycloak?.authenticated || !keycloak.token,
    context: {
      ...options?.context,
      headers: {
        ...(options?.context?.headers || {}),
        authorization: `Bearer ${keycloak?.token}`,
      },
    },
  });
}

export function useMutation<
  TData = any,
  TVariables = OperationVariables,
  TContext = DefaultContext,
  TCache extends ApolloCache<any> = ApolloCache<any>,
>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: MutationHookOptions<NoInfer<TData>, NoInfer<TVariables>, TContext, TCache>,
): MutationTuple<TData, TVariables, TContext, TCache> {
  const keycloak = useKeycloak();
  return apolloUseMutation(mutation, {
    ...options,
    context: {
      ...options?.context,
      headers: {
        ...((options?.context as DefaultContext)?.headers || {}),
        authorization: `Bearer ${keycloak?.token}`,
      },
    } as TContext,
  });
}
