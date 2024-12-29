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

interface HydratedStore {
  __hydrated?: boolean;
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
    const [storageState, setStorageState] = useState<Record<string, any>>();
    const persistKey = useMemo(
      () =>
        persistKeyPrefix +
        (typeof persist === "string" ? persist : StoreKlass.name),
      [persist, StoreKlass.name],
    );
    const HydratedStore = useMemo(() => {
      console.log("Creating HydratedStore with state:", storageState);
      if (!storageState) return StoreKlass;
      return class extends StoreKlass implements HydratedStore {
        __hydrated?: boolean;
        #state: Record<string, any>;

        constructor(props: Props) {
          super(props);
          this.__hydrated = true;
          console.log("Hydrating store with state:", storageState);
          this.#state = { ...storageState };
          Object.keys(storageState as object).forEach((key) => {
            Object.defineProperty(this, key, {
              get: () => this.#state[key],
              set: (value) => {
                this.#state[key] = value;
              },
              enumerable: true,
              configurable: true,
            });
          });
        }
      };
    }, [storageState, StoreKlass]);
    const store = useStore(HydratedStore as any, props, options);
    const persistedStore = useMemo(() => {
      if (!store) return undefined;
      return new Proxy(store, {
        set(target, prop, value) {
          console.log("Setting store prop:", { prop, value });
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
                console.log("Persisting state:", { ...state, ...updates });
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
    }, [store, persistKey]);

    useEffect(() => {
      (async () => {
        const item = await AsyncStorage.getItem(persistKey);
        console.log("Loading from storage:", { persistKey, item });
        if (item) {
          const state = JSON.parse(item).state || {};
          console.log("Setting storage state:", state);
          setStorageState(state);
        } else {
          setStorageState({});
        }
      })().catch(logger.error);
    }, [persistKey, props]);

    if (!storageState || !store) return undefined;
    return persistedStore as any;
  };
}
