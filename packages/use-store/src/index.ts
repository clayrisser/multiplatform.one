/*
 * File: /src/index.ts
 * Project: @multiplatform.one/use-store
 * File Created: 01-01-1970 00:00:00
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

export interface CreateUseStoreOptions {
  blacklist?: string[];
  persist?: boolean | string;
  whitelist?: string[];
}

const PERSIST_KEY_PREFIX = "tamagui-store/";
const logger = console;

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
    const [storage, setStorage] = useState<Record<string, any>>();
    const store = useStore(StoreKlass as any, props, options);

    const persistKey = useMemo(
      () =>
        PERSIST_KEY_PREFIX +
        (typeof persist === "string" ? persist : StoreKlass.name),
      [persist, StoreKlass.name],
    );

    const persistedStore = useMemo(
      () =>
        new Proxy(store, {
          set(target, prop, value) {
            (target as any)[prop] = value;
            if (
              prop === "__hydrated" ||
              typeof prop !== "string" ||
              (!(
                typeof value === "boolean" ||
                typeof value === "number" ||
                typeof value === "object" ||
                typeof value === "string" ||
                typeof value === "undefined" ||
                value === null
              ) &&
                (whitelist?.includes(prop) || !blacklist?.includes(prop)))
            ) {
              return true;
            }
            (async () => {
              try {
                const item = await AsyncStorage.getItem(persistKey);
                const state = (item ? JSON.parse(item) : {}).state || {};
                state[prop] = value;

                await AsyncStorage.setItem(
                  persistKey,
                  JSON.stringify({ state }),
                );
              } catch (err) {
                logger.error(err);
              }
            })();
            return true;
          },
        }),
      [store, persistKey],
    );

    useEffect(() => {
      (async () => {
        const item = await AsyncStorage.getItem(persistKey);
        if (item) {
          try {
            setStorage(JSON.parse(item));
          } catch (err) {
            setStorage({});
            logger.error(err);
          }
        } else {
          setStorage({});
        }
      })();
    }, [persistKey]);

    useEffect(() => {
      if (store.__hydrated || !storage) return;
      Object.assign(store, storage.state || {});
      store.__hydrated = true;
    }, [store, storage]);

    if (!storage) return undefined;
    return persistedStore;
  };
}
