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

export function createUseStore<Props, Store>(
  StoreKlass: (new (props: Props) => Store) | (new () => Store),
  options?: CreateUseStoreOptions & { persist?: false },
): <Res, C extends Selector<Store, Res>, Props extends object>(
  props?: Props,
  options?: UseStoreOptions,
) => C extends Selector<any, infer B> ? (B extends object ? B : Store) : Store;
export function createUseStore<Props, Store>(
  StoreKlass: (new (props: Props) => Store) | (new () => Store),
  options: CreateUseStoreOptions & { persist: string | true },
): <Res, C extends Selector<Store, Res>, Props extends object>(
  props?: Props,
  options?: UseStoreOptions,
) =>
  | (C extends Selector<any, infer B> ? (B extends object ? B : Store) : Store)
  | undefined;
export function createUseStore<Props, Store>(
  StoreKlass: (new (props: Props) => Store) | (new () => Store),
  { persist, whitelist, blacklist }: CreateUseStoreOptions = {},
) {
  return <Res, C extends Selector<Store, Res>, Props extends object>(
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
      return class extends (StoreKlass as any) {
        constructor(props: Props) {
          super(props);
          if (storageState) {
            Object.entries(storageState).forEach(([key, value]) => {
              if (key in this) {
                this[key] = value;
              }
            });
          }
        }
      };
    }, [storageState, StoreKlass]);

    const store = useStore(HydratedStore as any, props, options);

    useEffect(() => {
      if (!store) return;
      const state = Object.entries(store as any).reduce(
        (acc, [key, value]) => {
          if (
            typeof value !== "function" &&
            (whitelist?.includes(key) || !blacklist?.includes(key))
          ) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>,
      );
      AsyncStorage.setItem(persistKey, JSON.stringify({ state })).catch(
        logger.error,
      );
    }, [store, persistKey]);

    useEffect(() => {
      (async () => {
        try {
          const item = await AsyncStorage.getItem(persistKey);
          if (item) {
            const state = JSON.parse(item).state || {};
            setStorageState(state);
          } else {
            const instance = new (StoreKlass as any)(props);
            const state = Object.entries(instance).reduce(
              (acc, [key, value]) => {
                if (typeof value !== "function") {
                  acc[key] = value;
                }
                return acc;
              },
              {} as Record<string, any>,
            );
            await AsyncStorage.setItem(persistKey, JSON.stringify({ state }));
            setStorageState(state);
          }
        } catch (err) {
          logger.error(err);
        }
      })();
    }, [persistKey, props]);

    if (!storageState || !store) return undefined;
    return store as any;
  };
}
