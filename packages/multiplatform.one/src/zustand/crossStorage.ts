/**
 * File: /src/zustand/crossStorage.ts
 * Project: multiplatform.one
 * File Created: 18-06-2023 15:37:00
 * Author: Clay Risser
 * -----
 * Last Modified: 18-06-2023 17:37:24
 * Modified By: Clay Risser
 * -----
 * Risser Labs LLC (c) Copyright 2022 - 2023
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

import mergeOptions from 'merge-options';
import type { AsyncStorageStatic } from '@react-native-async-storage/async-storage';
import type { CrossStorageClientOptions } from 'cross-storage';
import { CrossStorageClient } from 'cross-storage';
import type {
  CallbackWithResult,
  KeyValuePair,
  MultiCallback,
  MultiGetCallback,
} from '@react-native-async-storage/async-storage/lib/typescript/types';

export function createAsyncCrossStorage({ hubUrl, onConnect, ...options }: CreateAsyncCrossStorageOptions) {
  const storage = new CrossStorageClient(hubUrl, options);
  const connection: CrossStorageConnection = {
    onConnectCallbacks: [],
    onErrorCallbacks: [],
    connected: false,
  };
  storage
    .onConnect()
    .then(() => {
      connection.connected = true;
      while (connection.onConnectCallbacks.length) {
        const callback = connection.onConnectCallbacks.pop();
        callback?.();
      }
      connection.onErrorCallbacks = [];
      if (onConnect) onConnect();
    })
    .catch((err) => {
      while (connection.onErrorCallbacks.length) {
        const callback = connection.onErrorCallbacks.pop();
        callback?.(err);
      }
    });
  const AsyncCrossStorage: AsyncStorageStatic = {
    async getItem(key: string, callback?: CallbackWithResult<string>): Promise<string | null> {
      return operation(() => storage.get(key), connection, callback);
    },
    async setItem(key: string, value: string, callback?: CallbackWithResult<string>): Promise<void> {
      return operation(() => storage.set(key, value), connection, callback);
    },
    async removeItem(key: string, callback?: CallbackWithResult<string>): Promise<void> {
      return operation(() => storage.del(key), connection, callback);
    },
    async mergeItem(key: string, value: string, callback?: CallbackWithResult<string>): Promise<void> {
      return operation(() => mergeCrossStorageItem(storage, key, value), connection, callback);
    },
    async clear(callback?: CallbackWithResult<string>): Promise<void> {
      return operation(() => storage.clear(), connection, callback);
    },
    async getAllKeys(callback?: CallbackWithResult<string[]>): Promise<string[]> {
      return operation(() => storage.getKeys(), connection, callback);
    },
    flushGetRequests: () => undefined,
    async multiGet(keys: readonly string[], callback?: MultiGetCallback): Promise<readonly KeyValuePair[]> {
      return operation(() => Promise.all(keys.map((key) => storage.get(key))), connection, callback);
    },
    async multiSet(keyValuePairs: [string, string][], callback?: MultiCallback): Promise<void> {
      return operation(
        async () => {
          await Promise.all(keyValuePairs.map(([key, value]) => storage.set(key, value)));
        },
        connection,
        callback,
      );
    },
    async multiRemove(keys: readonly string[], callback?: MultiCallback): Promise<void> {
      return operation(
        async () => {
          await Promise.all(keys.map((key) => storage.del(key)));
        },
        connection,
        callback,
      );
    },
    async multiMerge(keyValuePairs: [string, string][], callback?: MultiCallback): Promise<void> {
      return operation(
        async () => {
          await Promise.all(keyValuePairs.map(([key, value]) => mergeCrossStorageItem(storage, key, value)));
        },
        connection,
        callback,
      );
    },
  };
  return AsyncCrossStorage;
}

async function operation<Result, Callback extends Function>(
  getValue: () => Promise<Result>,
  connection: CrossStorageConnection,
  callback?: Callback,
): Promise<Result> {
  if (!connection.connected) {
    await new Promise((resolve, reject) => {
      connection.onConnectCallbacks.push(resolve);
      connection.onErrorCallbacks.push(reject);
    });
  }
  const value = await getValue();
  callback?.(null, value);
  return value;
}

async function mergeCrossStorageItem(storage: CrossStorageClient, key: string, value: string) {
  const oldValue = await storage.get(key);
  if (oldValue) {
    const oldObject = JSON.parse(oldValue);
    const newObject = JSON.parse(value);
    const nextValue = JSON.stringify(merge(oldObject, newObject));
    await storage.set(key, nextValue);
  } else {
    await storage.set(key, value);
  }
}

const merge = mergeOptions.bind({
  concatArrays: true,
  ignoreUndefined: true,
});

export interface CrossStorageConnection {
  onConnectCallbacks: Function[];
  onErrorCallbacks: ((err: Error) => void)[];
  connected: boolean;
}

export interface CreateAsyncCrossStorageOptions extends CrossStorageClientOptions {
  hubUrl: string;
  onConnect?: () => void;
}
