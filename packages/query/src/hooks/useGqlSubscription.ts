/*
 *  File: /src/hooks/useGqlSubscription.ts
 *  Project: @multiplatform.one/query
 *  File Created: 30-05-2024 12:16:09
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
import { useKeycloak } from '@multiplatform.one/keycloak';
import { useQueryClient } from '@tanstack/react-query';
import { useSubscription } from '@apollo/client';
import type {
  DefaultContext,
  DocumentNode,
  NoInfer,
  OperationVariables,
  SubscriptionHookOptions,
  SubscriptionResult,
  TypedDocumentNode,
} from '@apollo/client';

export interface UseGqlSubscriptionOptions<
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
  TQueryKey extends QueryKey = QueryKey,
> extends Partial<Omit<SubscriptionHookOptions<NoInfer<TData>, NoInfer<TVariables>>, 'skip'>> {
  enabled?: boolean;
  query: DocumentNode | TypedDocumentNode<TData, TVariables>;
  queryKey?: TQueryKey;
  updatedAt?: number;
}

const excludedApolloSubscriptionOptionsKeys = new Set(['query', 'enabled', 'queryKey', 'updatedAt']);
declare const dataTagSymbol: unique symbol;
type DataTag<TType, TValue> = TType & {
  [dataTagSymbol]: TValue;
};

export function useGqlSubscription<
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
  TQueryFnData = unknown,
  TTaggedQueryKey extends QueryKey = QueryKey,
  TInferredQueryFnData = TTaggedQueryKey extends DataTag<unknown, infer TaggedValue> ? TaggedValue : TQueryFnData,
>(options: UseGqlSubscriptionOptions<TData, TVariables, TTaggedQueryKey>): SubscriptionResult<TData, TVariables> {
  const keycloak = useKeycloak();
  const queryClient = useQueryClient();
  return useSubscription(options.query, {
    ...Object.entries(options).reduce((options, [key, value]) => {
      if (!excludedApolloSubscriptionOptionsKeys.has(key)) options[key] = value;
      return options;
    }, {}),
    skip: !(typeof options?.enabled !== 'undefined' ? options.enabled : !!(keycloak?.authenticated && keycloak.token)),
    onData: ({ client, data }) => {
      if (options.queryKey) {
        queryClient.setQueryData(options.queryKey, data as NoInfer<TInferredQueryFnData> | undefined, {
          updatedAt: options.updatedAt,
        });
      }
      if (options.onData) return options.onData({ client, data });
    },
    context: {
      ...options?.context,
      headers: {
        ...((options?.context as DefaultContext)?.headers || {}),
        authorization: `Bearer ${keycloak?.token}`,
      },
    },
  });
}
