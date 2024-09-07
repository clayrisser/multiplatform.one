/*
 * File: /src/hooks/useIpcQuery.ts
 * Project: @multiplatform.one/electron
 * File Created: 17-06-2024 08:19:48
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

import { useQuery as useTanstackQuery } from "@tanstack/react-query";
import type {
  DefaultError,
  DefinedInitialDataOptions,
  QueryClient,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { ipcQuery } from "../request";

const extraOptionsKeys = new Set(["handler", "variables"]);

interface ExtraOptions<
  THandler extends string = string,
  TVariables extends object = {},
> {
  handler: THandler;
  variables?: TVariables;
}

export function useIpcQuery<
  TQueryFnData extends object = {},
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  THandler extends string = string,
  TVariables extends object = {},
>(
  options: Omit<
    | DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryFn" | "queryKey"
  > &
    ExtraOptions<THandler, TVariables>,
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> {
  const tanstackQueryOptions = Object.entries(options).reduce(
    (tanstackQueryOptions, [key, value]) => {
      if (!extraOptionsKeys.has(key)) tanstackQueryOptions[key] = value;
      return tanstackQueryOptions;
    },
    {},
  ) as
    | DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
    | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>;
  return useTanstackQuery<TQueryFnData, TError, TData, TQueryKey>(
    {
      ...tanstackQueryOptions,
      async queryFn() {
        return ipcQuery<THandler, TVariables, TQueryFnData>(
          options.handler,
          options.variables,
        );
      },
    },
    queryClient,
  );
}
