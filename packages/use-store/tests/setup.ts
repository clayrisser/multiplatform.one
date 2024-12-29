/*
 * File: /tests/setup.ts
 * Project: @multiplatform.one/use-store
 * File Created: 29-12-2024 07:26:38
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

import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";
import { cleanup } from "@testing-library/react";
import { vi } from "vitest";

configure({
  asyncUtilTimeout: 5000,
});

const stores = new Map<string, any>();
const persistedStores = new Map<string, any>();

vi.mock("@tamagui/use-store", () => ({
  useStore: vi.fn().mockImplementation((StoreKlass, options) => {
    const key = StoreKlass.name;
    if (!stores.has(key)) {
      const store = new StoreKlass(options?.state);
      if (options?.persist) {
        const proxy = new Proxy(store, {
          set(target, prop, value) {
            (target as any)[prop] = value;
            if (prop !== "__hydrated") {
              persistedStores.set(key, { state: target });
            }
            return true;
          },
        });
        stores.set(key, proxy);
      } else {
        stores.set(key, store);
      }
    }
    return stores.get(key);
  }),
}));

const storage = new Map<string, string>();

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn().mockImplementation((key: string) => {
      const storeKey = key.replace("tamagui-store/", "");
      const persistedStore = persistedStores.get(storeKey);
      if (persistedStore) {
        return Promise.resolve(JSON.stringify(persistedStore));
      }
      const storedValue = storage.get(key);
      if (storedValue) {
        const data = JSON.parse(storedValue);
        persistedStores.set(storeKey, data);
        return Promise.resolve(storedValue);
      }
      return Promise.resolve(null);
    }),
    setItem: vi.fn().mockImplementation((key: string, value: string) => {
      const storeKey = key.replace("tamagui-store/", "");
      const data = JSON.parse(value);
      persistedStores.set(storeKey, data);
      storage.set(key, value);
      return Promise.resolve();
    }),
    removeItem: vi.fn(),
    clear: vi.fn(),
    getAllKeys: vi.fn(),
    multiGet: vi.fn(),
    multiSet: vi.fn(),
    multiRemove: vi.fn(),
  },
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  stores.clear();
  storage.clear();
  persistedStores.clear();
});
