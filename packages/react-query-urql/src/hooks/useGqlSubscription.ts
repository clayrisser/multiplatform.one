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

export function useGqlSubscription<
  TData = any,
  TResult = TData,
  TVariables extends AnyVariables = AnyVariables,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseGqlSubscriptionOptions<TData, TVariables, TQueryKey>,
  handler?: SubscriptionHandler<TData, TResult>,
): UseSubscriptionState<TResult, TVariables> {
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

  if (response.error) throw response.error;

  return response;
}
