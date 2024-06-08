/*
 * File: /src/hooks/useGqlQuery.ts
 * Project: @multiplatform.one/query
 * File Created: 01-06-2024 13:44:49
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

import type { OperationVariables, QueryOptions } from '@apollo/client';
import { useApolloClient } from '@apollo/client';
import { useKeycloak } from '@multiplatform.one/keycloak';
import { useQuery as useTanstackQuery } from '@tanstack/react-query';
import type {
  DefaultError,
  DefinedInitialDataOptions,
  QueryClient,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

const apolloQueryOptionsKeys = new Set([
  'canonizeResults',
  'context',
  'errorPolicy',
  'fetchPolicy',
  'notifyOnNetworkStatusChange',
  'partialRefetch',
  'pollInterval',
  'query',
  'returnPartialData',
  'variables',
]);

export function useGqlQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TVariables extends OperationVariables = OperationVariables,
>(
  options: Omit<
    | DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryFn' | 'queryKey'
  > &
    QueryOptions<TVariables, TData> & {
      queryKey?: TQueryKey;
    },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> {
  const keycloak = useKeycloak();
  const client = useApolloClient();
  const apolloQueryOptions = [...apolloQueryOptionsKeys].reduce((apolloQueryOptions, key) => {
    if (options.hasOwnProperty(key)) apolloQueryOptions[key] = options[key];
    return apolloQueryOptions;
  }, {}) as QueryOptions<TVariables, TData>;
  const tanstackQueryOptions = Object.entries(options).reduce((tanstackQueryOptions, [key, value]) => {
    if (!apolloQueryOptionsKeys.has(key)) tanstackQueryOptions[key] = value;
    return tanstackQueryOptions;
  }, {}) as
    | DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>;
  return useTanstackQuery<TQueryFnData, TError, TData, TQueryKey>(
    {
      ...tanstackQueryOptions,
      queryKey: tanstackQueryOptions.queryKey || options.query,
      enabled:
        typeof tanstackQueryOptions?.enabled !== 'undefined'
          ? tanstackQueryOptions.enabled
          : !!(keycloak?.authenticated && keycloak.token),
      async queryFn() {
        return (
          await client.query<TQueryFnData, TVariables>({
            ...apolloQueryOptions,
            context: {
              ...apolloQueryOptions?.context,
              headers: {
                ...(apolloQueryOptions?.context?.headers || {}),
                authorization: `Bearer ${keycloak?.token}`,
              },
            },
          })
        ).data;
      },
    },
    queryClient,
  );
}
