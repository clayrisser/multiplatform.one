/**
 * File: /src/zustand/index.native.ts
 * Project: multiplatform.one
 * File Created: 01-02-2023 09:10:54
 * Author: Clay Risser
 * -----
 * Last Modified: 18-06-2023 16:49:07
 * Modified By: Clay Risser
 * -----
 * BitSpur (c) Copyright 2022 - 2023
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
import type { CrossStorageClientOptions } from 'cross-storage';
import type { InitStateType } from 'zustand-tools/dist/types';
import type { PersistOptions } from 'zustand/middleware';
import { createSimple } from 'zustand-tools';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const g: any = global;

export function createStateStore<State extends InitStateType, Actions extends ActionsType<State>>(
  name: string,
  initState: State,
  actions?: Actions,
  options: CreateOptions<State, Actions> = {},
): ReturnType<typeof createSimple> {
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
                storage: createJSONStorage(() => AsyncStorage),
                ...((typeof options.persist === 'object' ? options.persist : {}) as Partial<PersistOptions<any>>),
              }),
          ] as MiddlewareOptionType<State & ReturnType<Actions>>[])
        : []),
      ...(options.middlewares || []),
    ],
  });
  return store;
}

export function setDefaultCrossStorage(_hubUrl: string, _options?: Partial<CrossStorageClientOptions>) {
  return;
}
