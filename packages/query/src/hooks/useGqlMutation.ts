/*
 *  File: /src/hooks/useGqlMutation.ts
 *  Project: @multiplatform.one/query
 *  File Created: 30-05-2024 08:38:01
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

import type { QueryKey, UseMutationResult, DefaultError, UseMutationOptions, QueryClient } from '@tanstack/react-query';
import { useKeycloak } from '@multiplatform.one/keycloak';
import { useMutation as useApolloMutation } from '@apollo/client';
import { useQueryClient, useMutation as useTanstackMutation } from '@tanstack/react-query';
import type {
  ApolloCache,
  DefaultContext,
  DocumentNode,
  MutationFunctionOptions,
  MutationHookOptions,
  NoInfer,
  OperationVariables,
  TypedDocumentNode,
} from '@apollo/client';

const apolloMutationOptionsKeys = new Set(['client']);
const extraOptionsKeys = new Set(['mutation', 'queryKey']);

interface ExtraOptions<TQueryKeys extends QueryKey[], AData = any, AVariables = OperationVariables> {
  invalidateQueryKeys?: TQueryKeys;
  mutation: DocumentNode | TypedDocumentNode<AData, AVariables>;
}

export type ApolloMutationOptions<
  TData = any,
  TVariables = OperationVariables,
  AContext = DefaultContext,
  TCache extends ApolloCache<any> = ApolloCache<any>,
> = Omit<
  MutationHookOptions<NoInfer<TData>, NoInfer<TVariables>, AContext, TCache>,
  'ignoreResults' | 'notifyOnNetworkStatusChange' | 'onCompleted' | 'onError'
>;

export function useGqlMutation<
  TData = unknown,
  TError = DefaultError,
  TVariables = OperationVariables,
  TContext = unknown,
  AContext = DefaultContext,
  TCache extends ApolloCache<any> = ApolloCache<any>,
  TQueryKeys extends QueryKey[] = QueryKey[],
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext> &
    ApolloMutationOptions<TData, TVariables, AContext, TCache> &
    ExtraOptions<TQueryKeys, TData, TVariables>,
  queryClient?: QueryClient,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const apolloMutationOptions = [...apolloMutationOptionsKeys].reduce((apolloMutationOptions, key) => {
    if (options.hasOwnProperty(key)) apolloMutationOptions[key] = options[key];
    return apolloMutationOptions;
  }, {}) as ApolloMutationOptions<TData, TVariables, AContext, TCache>;
  const extraOptions = [...extraOptionsKeys].reduce((extraOptions, key) => {
    if (options.hasOwnProperty(key)) extraOptions[key] = options[key];
    return extraOptions;
  }, {}) as ExtraOptions<TQueryKeys, TData, TVariables>;
  const tanstackMutationOptions = Object.entries(options).reduce((tanstackMutationOptions, [key, value]) => {
    if (!apolloMutationOptionsKeys.has(key) && !extraOptionsKeys.has(key)) tanstackMutationOptions[key] = value;
    return tanstackMutationOptions;
  }, {}) as UseMutationOptions<TData, TError, TVariables, TContext>;
  const keycloak = useKeycloak();
  const tanstackQueryClient = useQueryClient();
  const [mutate] = useApolloMutation<TData, TVariables, AContext, TCache>(extraOptions.mutation, {
    ...apolloMutationOptions,
    context: {
      ...apolloMutationOptions?.context,
      headers: {
        ...((apolloMutationOptions?.context as any)?.headers || {}),
        authorization: `Bearer ${keycloak?.token}`,
      },
    } as AContext,
  });
  return useTanstackMutation<TData, TError, TVariables, TContext>(
    {
      ...tanstackMutationOptions,
      async mutationFn(variables: TVariables): Promise<TData> {
        return mutate({
          variables,
        } as MutationFunctionOptions<TData, TVariables, AContext, TCache>) as Promise<TData>;
      },
      async onMutate(variables: TVariables) {
        (extraOptions?.invalidateQueryKeys || []).forEach((queryKey) =>
          tanstackQueryClient.invalidateQueries({ queryKey }),
        );
        if (tanstackMutationOptions.onMutate) return tanstackMutationOptions.onMutate(variables);
      },
    },
    queryClient,
  );
}
