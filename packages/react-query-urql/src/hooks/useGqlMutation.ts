/*
 * File: /src/hooks/useGqlMutation.ts
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

import type { AnyVariables } from '../types';
import type { DocumentInput, OperationContext } from 'urql';
import type { QueryKey, UseMutationResult, DefaultError, UseMutationOptions, QueryClient } from '@tanstack/react-query';
import { useKeycloak } from '@multiplatform.one/keycloak';
import { useMutation } from 'urql';
import { useQueryClient, useMutation as useTanstackMutation } from '@tanstack/react-query';

const extraOptionsKeys = new Set(['mutation', 'invalidateQueryKeys', 'context']);

interface ExtraOptions<TQueryKeys extends QueryKey[], TData = any, TVariables = AnyVariables> {
  context?: Partial<OperationContext>;
  invalidateQueryKeys?: TQueryKeys;
  mutation: DocumentInput<TData, TVariables>;
}

export function useGqlMutation<
  TData = any,
  TError = DefaultError,
  TVariables extends AnyVariables = AnyVariables,
  TContext = unknown,
  TQueryKeys extends QueryKey[] = QueryKey[],
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext> & ExtraOptions<TQueryKeys, TData, TVariables>,
  queryClient?: QueryClient,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const extraOptions = [...extraOptionsKeys].reduce((extraOptions, key) => {
    if (options.hasOwnProperty(key)) extraOptions[key] = options[key];
    return extraOptions;
  }, {}) as ExtraOptions<TQueryKeys, TData, TVariables>;
  const tanstackMutationOptions = Object.entries(options).reduce((tanstackMutationOptions, [key, value]) => {
    if (!extraOptionsKeys.has(key)) tanstackMutationOptions[key] = value;
    return tanstackMutationOptions;
  }, {}) as UseMutationOptions<TData, TError, TVariables, TContext>;
  const keycloak = useKeycloak();
  const tanstackQueryClient = useQueryClient();
  const [, mutate] = useMutation<TData, TVariables>(extraOptions.mutation);
  return useTanstackMutation<TData, TError, TVariables, TContext>(
    {
      ...tanstackMutationOptions,
      async mutationFn(variables: TVariables): Promise<TData> {
        const { data, error } = await mutate(variables, {
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
        });
        if (error) throw error;
        if (!data) throw new Error('no data returned from mutation');
        return data;
      },
      async onMutate(variables: TVariables) {
        (extraOptions?.invalidateQueryKeys || []).forEach((queryKey) =>
          tanstackQueryClient.invalidateQueries({ queryKey }),
        );
        if (tanstackMutationOptions.onMutate) return tanstackMutationOptions.onMutate(variables);
        return undefined;
      },
    },
    queryClient,
  );
}
