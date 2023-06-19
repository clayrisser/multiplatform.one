/**
 * File: /src/zustand/zustand.ts
 * Project: multiplatform.one
 * File Created: 01-02-2023 09:10:54
 * Author: Clay Risser
 * -----
 * Last Modified: 19-06-2023 17:09:10
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

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ActionsType, CreateOptions, MiddlewareOptionType } from './types';
import type { CreateSimpleHooksType, InitStateType } from 'zustand-tools/dist/types';
import type { CrossStorageClientOptions } from 'cross-storage';
import type { PersistOptions } from 'zustand/middleware';
import type { StoreApi, UseBoundStore } from 'zustand';
import { createAsyncCrossStorage } from './crossStorage';
import { createSimple } from 'zustand-tools';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const g: any = typeof window === 'undefined' ? global : window;

export function createStateStore<State extends InitStateType, Actions extends ActionsType<State>>(
  name: string,
  initState: State,
  actions?: Actions,
  options: CreateOptions<State, Actions> = {},
): {
  useStore: UseBoundStore<
    StoreApi<
      State & {
        [Property in keyof State as `set${Capitalize<string & Property>}`]: (value: State[Property]) => void;
      } & ReturnType<Actions>
    >
  >;
  hooks: {
    useAllData: () => {
      [k: string]: any;
    };
  } & CreateSimpleHooksType<State>;
} {
  const crossStorage = {
    ...(typeof window !== 'undefined' && window._defaultCrossStorage),
    ...options.crossStorage,
  };
  const hubUrl = crossStorage?.hubUrl;
  const store = createSimple(initState, {
    actions,
    middlewares: [
      ...(options.devtools === false || typeof g?.__REDUX_DEVTOOLS_EXTENSION__ !== 'function'
        ? []
        : ([
            (initializer) =>
              devtools(initializer, {
                name,
                enabled: true,
                ...(typeof options.devtools === 'object' ? options.devtools : {}),
              }),
          ] as MiddlewareOptionType<State & ReturnType<Actions>>[])),
      (initializer) => immer(initializer),
      ...(options.persist
        ? ([
            (initializer) =>
              persist(initializer, {
                name,
                storage: createJSONStorage(() =>
                  typeof window !== 'undefined' &&
                  window?.self !== window?.top &&
                  typeof hubUrl !== 'undefined' &&
                  hubUrl
                    ? createAsyncCrossStorage({ ...crossStorage, hubUrl })
                    : AsyncStorage,
                ),
                ...((typeof options.persist === 'object' ? options.persist : {}) as Partial<PersistOptions<any>>),
              }),
          ] as MiddlewareOptionType<State & ReturnType<Actions>>[])
        : []),
      ...(options.middlewares || []),
    ],
  });
  return store;
}

export function setDefaultCrossStorage(hubUrl: string, options?: Partial<CrossStorageClientOptions>) {
  if (typeof window === 'undefined') return;
  window._defaultCrossStorage = {
    hubUrl,
    ...options,
  };
}

declare global {
  interface Window {
    _defaultCrossStorage?: Partial<CrossStorageClientOptions & { hubUrl: string }>;
  }
}

export type * from './types';
export * from './crossStorage';
