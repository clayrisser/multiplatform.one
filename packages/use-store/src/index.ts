/*
 * File: /src/index.ts
 * Project: @multiplatform.one/use-store
 * File Created: 29-12-2024 12:31:51
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

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  type Selector,
  type UseStoreOptions,
  useStore,
} from "@tamagui/use-store";
import { useEffect, useMemo, useState } from "react";

const logger = console;

export interface CreateUseStoreOptions {
  blacklist?: string[];
  persist?: boolean | string;
  whitelist?: string[];
}

const persistKeyPrefix = "tamagui-store/";

export function createUseStore<
  P extends object | undefined,
  Store extends object,
>(
  StoreKlass: (new (props: P) => Store) | (new () => Store),
  options?: CreateUseStoreOptions & { persist?: false },
): <Res, C extends Selector<Store, Res>, Props extends NonNullable<P>>(
  props?: Props,
  options?: UseStoreOptions,
) => C extends Selector<any, infer B> ? (B extends object ? B : Store) : Store;
export function createUseStore<
  P extends object | undefined,
  Store extends object,
>(
  StoreKlass: (new (props: P) => Store) | (new () => Store),
  options: CreateUseStoreOptions & { persist: string | true },
): <Res, C extends Selector<Store, Res>, Props extends NonNullable<P>>(
  props?: Props,
  options?: UseStoreOptions,
) =>
  | (C extends Selector<any, infer B> ? (B extends object ? B : Store) : Store)
  | undefined;
export function createUseStore<
  P extends object | undefined,
  Store extends object,
>(
  StoreKlass: (new (props: P) => Store) | (new () => Store),
  { persist, whitelist, blacklist }: CreateUseStoreOptions = {},
) {
  return <Res, C extends Selector<Store, Res>, Props extends NonNullable<P>>(
    props?: Props,
    options?: UseStoreOptions,
  ):
    | (C extends Selector<any, infer B>
        ? B extends object
          ? B
          : Store
        : Store)
    | undefined => {
    if (!persist) return useStore(StoreKlass as any, props, options);
    const [storageState, setStorageState] = useState<Record<string, any>>();
    const persistKey = useMemo(
      () =>
        persistKeyPrefix +
        (typeof persist === "string" ? persist : StoreKlass.name),
      [persist, StoreKlass.name],
    );

    const HydratedStore = useMemo(() => {
      if (!storageState) return StoreKlass;
      const store = new StoreKlass(props as P);
      if (storageState?.state) {
        for (const [key, value] of Object.entries(storageState.state)) {
          if (key in store) {
            store[key] = value;
          }
        }
      }
      return store.constructor as any;
    }, [storageState, StoreKlass, props]);

    const store = useStore(HydratedStore, props, options);

    useEffect(() => {
      if (!store) return;
      const state: Partial<Store> = {};
      for (const key in store) {
        const value = store[key];
        if (
          !key.startsWith("_") &&
          (whitelist ? whitelist.includes(key) : !blacklist?.includes(key)) &&
          key !== "props" &&
          typeof value !== "function"
        ) {
          state[key] = value;
        }
      }
      AsyncStorage.setItem(persistKey, JSON.stringify({ state })).catch(
        logger.error,
      );
    }, [store, persistKey, whitelist, blacklist]);

    useEffect(() => {
      (async () => {
        try {
          const item = await AsyncStorage.getItem(persistKey);
          if (item) {
            const parsed = JSON.parse(item);
            if (parsed.state) {
              const filteredState = {};
              for (const [key, value] of Object.entries(parsed.state)) {
                if (
                  !key.startsWith("_") &&
                  key !== "props" &&
                  (whitelist
                    ? whitelist.includes(key)
                    : !blacklist?.includes(key))
                ) {
                  filteredState[key] = value;
                }
              }
              setStorageState({ state: filteredState });
            } else {
              setStorageState({});
            }
          } else {
            setStorageState({});
          }
        } catch (err) {
          logger.error(err);
        }
      })();
    }, [persistKey, whitelist, blacklist]);

    if (!storageState || !store) return undefined;
    return store as any;
  };
}
