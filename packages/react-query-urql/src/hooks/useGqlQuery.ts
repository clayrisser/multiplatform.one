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

import type { DocumentNode } from 'graphql';
import type { TypedDocumentNode, OperationContext } from 'urql';
import { useClient } from 'urql';
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

const extraOptionsKeys = new Set(['context', 'query', 'variables']);

interface ExtraOptions<TQueryFnData = unknown, TData = TQueryFnData, TVariables extends object = {}> {
  context?: Partial<OperationContext>;
  query: DocumentNode | TypedDocumentNode<TData, TVariables> | string;
  variables: TVariables;
}

export function useGqlQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TVariables extends object = {},
>(
  options: Omit<
    | DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryFn' | 'queryKey'
  > &
    ExtraOptions<TQueryFnData, TData, TVariables> & {
      queryKey?: TQueryKey;
    },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> {
  const keycloak = useKeycloak();
  const client = useClient();
  const extraOptions = [...extraOptionsKeys].reduce((extraQueryOptions, key) => {
    if (options.hasOwnProperty(key)) extraQueryOptions[key] = options[key];
    return extraQueryOptions;
  }, {}) as ExtraOptions<TQueryFnData, TData, TVariables>;
  const tanstackQueryOptions = Object.entries(options).reduce((tanstackQueryOptions, [key, value]) => {
    if (!extraOptionsKeys.has(key)) tanstackQueryOptions[key] = value;
    return tanstackQueryOptions;
  }, {}) as
    | DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>;
  return useTanstackQuery<TQueryFnData, TError, TData, TQueryKey>(
    {
      ...tanstackQueryOptions,
      queryKey: (options.queryKey || [options.query.toString()]) as TQueryKey,
      enabled:
        typeof tanstackQueryOptions?.enabled !== 'undefined'
          ? tanstackQueryOptions.enabled
          : !!(keycloak?.authenticated && keycloak.token),
      async queryFn() {
        const { data, error } = await client
          .query<TQueryFnData, TVariables>(extraOptions.query, extraOptions.variables, {
            ...extraOptions.context,
            fetchOptions: {
              ...extraOptions.context?.fetchOptions,
              headers: {
                ...(typeof extraOptions.context?.fetchOptions === 'function'
                  ? extraOptions.context?.fetchOptions()?.headers
                  : extraOptions.context?.fetchOptions?.headers),
                authorization: `Bearer ${keycloak?.token}`,
              },
            },
          })
          .toPromise();
        if (error) throw error;
        if (typeof data === 'undefined') throw new Error('no data returned from query');
        return data;
      },
    },
    queryClient,
  );
}
