/*
 * File: /src/hooks/useGqlSubscription.ts
 * Project: @multiplatform.one/react-query-urql
 * File Created: 24-06-2024 12:03:41
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

import { useMemo } from 'react';
import type { AnyVariables } from '../types';
import type { QueryKey } from '@tanstack/react-query';
import type { UseSubscriptionArgs, SubscriptionHandler, UseSubscriptionState } from 'urql';
import { useEffect } from 'react';
import { useKeycloak } from '@multiplatform.one/keycloak';
import { useQueryClient } from '@tanstack/react-query';
import { useSubscription } from 'urql';

export type UseGqlSubscriptionOptions<
  TData = any,
  TVariables extends AnyVariables = AnyVariables,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<UseSubscriptionArgs<TVariables, TData>, 'pause'> & {
  enabled?: boolean;
  queryKey?: TQueryKey;
  updatedAt?: number;
};

declare const dataTagSymbol: unique symbol;
type DataTag<TType, TValue> = TType & {
  [dataTagSymbol]: TValue;
};
type NoInfer<T> = [T][T extends any ? 0 : never];

export interface UseGqlSubscriptionResponse<TData = any, TVariables extends AnyVariables = AnyVariables>
  extends Omit<UseSubscriptionState<TData, TVariables>, 'fetching'> {
  isFetching: boolean;
}

export function useGqlSubscription<
  TData = any,
  TResult = TData,
  TVariables extends AnyVariables = AnyVariables,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseGqlSubscriptionOptions<TData, TVariables, TQueryKey>,
  handler?: SubscriptionHandler<TData, TResult>,
): UseGqlSubscriptionResponse<TResult, TVariables> {
  const keycloak = useKeycloak();
  const queryClient = useQueryClient();
  const [response] = useSubscription<TData, TResult, TVariables>(
    {
      pause: !(typeof options?.enabled !== 'undefined'
        ? options.enabled
        : !!(keycloak?.authenticated && keycloak.token)),
      context: useMemo(
        () => ({
          ...options.context,
          fetchOptions: {
            ...(typeof options.context?.fetchOptions === 'function'
              ? options.context.fetchOptions()
              : options.context?.fetchOptions),
            headers: {
              ...(typeof options.context?.fetchOptions === 'function'
                ? options.context.fetchOptions()?.headers
                : options.context?.fetchOptions?.headers),
              authorization: `Bearer ${keycloak?.token}`,
            },
          },
        }),
        [keycloak?.token, options.context],
      ),
      query: options.query,
      variables: options.variables as TVariables,
    },
    handler,
  );
  useEffect(() => {
    if (options.queryKey) {
      queryClient.setQueryData(
        options.queryKey,
        response.data as
          | NoInfer<TQueryKey extends DataTag<unknown, infer TaggedValue> ? TaggedValue : TData>
          | undefined,
        {
          updatedAt: options.updatedAt,
        },
      );
    }
  }, [response]);
  delete (response as { fetching: any }).fetching;
  return {
    ...response,
    isFetching: response.fetching,
  };
}
