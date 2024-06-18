/*
 * File: /src/hooks/useIpcMutation.ts
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

import type { IpcRequestOptions } from '../request';
import type { QueryKey, UseMutationResult, DefaultError, UseMutationOptions, QueryClient } from '@tanstack/react-query';
import { ipcMutation } from '../request';
import { useQueryClient, useMutation as useTanstackMutation } from '@tanstack/react-query';

const extraOptionsKeys = new Set(['handler', 'invalidateQueryKeys', 'timeout']);

interface ExtraOptions<TQueryKeys extends QueryKey[] = QueryKey[], THandler extends string = string> {
  handler: THandler;
  invalidateQueryKeys?: TQueryKeys;
}

export function useGqlMutation<
  TData extends object = {},
  TError = DefaultError,
  TContext = unknown,
  TQueryKeys extends QueryKey[] = QueryKey[],
  THandler extends string = string,
  TVariables extends object = {},
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext> &
    ExtraOptions<TQueryKeys, THandler> &
    IpcRequestOptions,
  queryClient?: QueryClient,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const tanstackMutationOptions = Object.entries(options).reduce((tanstackMutationOptions, [key, value]) => {
    if (!extraOptionsKeys.has(key)) tanstackMutationOptions[key] = value;
    return tanstackMutationOptions;
  }, {}) as UseMutationOptions<TData, TError, TVariables, TContext>;
  const tanstackQueryClient = useQueryClient();
  return useTanstackMutation<TData, TError, TVariables, TContext>(
    {
      ...tanstackMutationOptions,
      async mutationFn(variables: TVariables): Promise<TData> {
        return ipcMutation<THandler, TVariables, TData>(options.handler, variables, { timeout: options.timeout });
      },
      async onMutate(variables: TVariables) {
        (options?.invalidateQueryKeys || []).forEach((queryKey) => tanstackQueryClient.invalidateQueries({ queryKey }));
        if (tanstackMutationOptions.onMutate) return tanstackMutationOptions.onMutate(variables);
        return undefined;
      },
    },
    queryClient,
  );
}
