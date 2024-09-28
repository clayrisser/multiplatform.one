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
  persist?: boolean | string;
}

const logger = console;

export function createUseStore<Props, Store>(
  StoreKlass: (new (props: Props) => Store) | (new () => Store),
  options?: CreateUseStoreOptions,
): <Res, C extends Selector<Store, Res>, Props extends object>(
  props?: Props,
  options?: UseStoreOptions,
) => C extends Selector<any, infer B> ? (B extends object ? B : Store) : Store;
export function createUseStore<Props, Store>(
  StoreKlass: (new (props: Props) => Store) | (new () => Store),
  options: { persist: true },
): <Res, C extends Selector<Store, Res>, Props extends object>(
  props?: Props,
  options?: UseStoreOptions,
) => C extends Selector<any, infer B>
  ? B extends object
    ? B
    : Store
  : Store | undefined;
export function createUseStore<Props, Store>(
  StoreKlass: (new (props: Props) => Store) | (new () => Store),
  { persist }: CreateUseStoreOptions = {},
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
    const [hydrated, setHydrated] = useState(false);
    const [storage, setStorage] = useState<Record<string, any>>();
    let store = useStore(StoreKlass as any, props, options);
    if (!persist) return store;
    store = useMemo(
      () =>
        new Proxy(store, {
          set: (target, prop, value) => {
            (target as any)[prop] = value;
            (async () => {
              try {
                const previousValue = await AsyncStorage.getItem(
                  StoreKlass.name,
                );
                const stateToSave = previousValue
                  ? JSON.parse(previousValue)
                  : {};
                stateToSave[prop] = value;
                await AsyncStorage.setItem(
                  StoreKlass.name,
                  JSON.stringify(stateToSave),
                );
              } catch (err) {
                logger.error(err);
              }
            })();
            return true;
          },
        }),
      [store],
    );

    useEffect(() => {
      (async () => {
        const value = await AsyncStorage.getItem(StoreKlass.name);
        if (value) {
          try {
            setStorage(JSON.parse(value));
          } catch (err) {
            setStorage({});
            logger.error(err);
          }
        } else {
          setStorage({});
        }
      })();
    }, []);

    useEffect(() => {
      if (hydrated || !storage) return;
      Object.keys(storage).forEach((key) => {
        store[key] = storage[key];
      });
      setHydrated(true);
    }, [store, storage, hydrated]);

    if (!storage) return undefined;
    return store;
  };
}
