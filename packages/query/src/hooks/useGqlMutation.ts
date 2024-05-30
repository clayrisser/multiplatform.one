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

import type { QueryKey } from '@tanstack/react-query';
import { useMutation } from '@apollo/client';
import { useQueryClient } from '@tanstack/react-query';
import type {
  ApolloCache,
  DefaultContext,
  DocumentNode,
  FetchResult,
  MutationFunctionOptions,
  MutationHookOptions,
  MutationTuple,
  NoInfer,
  OperationVariables,
  TypedDocumentNode,
} from '@apollo/client';

export function useGqlMutation<
  TData = any,
  TVariables = OperationVariables,
  TContext = DefaultContext,
  TCache extends ApolloCache<any> = ApolloCache<any>,
  TQueryKey extends QueryKey = QueryKey,
>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  hookOptions?: MutationHookOptions<NoInfer<TData>, NoInfer<TVariables>, TContext, TCache> & {
    queryKey?: TQueryKey;
  },
): MutationTuple<TData, TVariables, TContext, TCache> {
  const tanstackQueryClient = useQueryClient();
  const [mutate, result] = useMutation<TData, TVariables, TContext, TCache>(mutation, hookOptions);
  return [
    async (
      options?: MutationFunctionOptions<TData, TVariables, TContext, TCache> | undefined,
    ): Promise<FetchResult<TData>> => {
      const result = await mutate(options);
      if (hookOptions?.queryKey) tanstackQueryClient.invalidateQueries({ queryKey: hookOptions.queryKey });
      return result;
    },
    result,
  ];
}
