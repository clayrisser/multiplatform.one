/**
 * File: /src/store.ts
 * Project: multiplatform.one
 * File Created: 23-12-2024 20:01:26
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
import { logger } from "./logger/index";

export interface CreateUseStoreOptions {
  blacklist?: string[];
  persist?: boolean | string;
  whitelist?: string[];
}

const pendingUpdates = new Map<string, Record<string, any>>();
const persistKeyPrefix = "tamagui-store/";
const updatePromises = new Map<string, Promise<void>>();

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
    const store = useMemo(() => {
      if (!storage?.state) return undefined;
      const instance = new (StoreKlass as any)(props);
      Object.assign(instance, storage.state);
      instance.__hydrated = true;
      return instance;
    }, [storage, props]);
    const persistKey = useMemo(
      () =>
        persistKeyPrefix +
        (typeof persist === "string" ? persist : StoreKlass.name),
      [persist, StoreKlass.name],
    );
    const persistedStore = useMemo(() => {
      if (!store) return undefined;
      const proxy = new Proxy(store, {
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
          const updates = pendingUpdates.get(persistKey) || {};
          updates[prop] = value;
          pendingUpdates.set(persistKey, updates);
          queueMicrotask(() => {
            const updates = pendingUpdates.get(persistKey);
            if (!updates) return;
            pendingUpdates.delete(persistKey);
            const current = updatePromises.get(persistKey) || Promise.resolve();
            const next = current.then(async () => {
              try {
                const item = await AsyncStorage.getItem(persistKey);
                const state = item ? JSON.parse(item).state || {} : {};
                await AsyncStorage.setItem(
                  persistKey,
                  JSON.stringify({ state: { ...state, ...updates } }),
                );
              } catch (err) {
                logger.error(err);
              }
            });
            updatePromises.set(persistKey, next);
          });
          return true;
        },
      });
      return proxy;
    }, [store, persistKey]);

    useEffect(() => {
      (async () => {
        const item = await AsyncStorage.getItem(persistKey);
        const state = item ? JSON.parse(item).state || {} : {};
        if (Object.keys(state).length > 0) {
          setStorage({ state });
        } else {
          const instance = new (StoreKlass as any)(props);
          setStorage({ state: instance });
        }
      })().catch(logger.error);
    }, [persistKey, props]);

    if (!storage || !store) return undefined;
    return persistedStore;
  };
}
