/*
 *  File: /src/zustand/types.ts
 *  Project: multiplatform.one
 *  File Created: 22-06-2023 05:33:21
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2023
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import type { CreateAsyncCrossStorageOptions } from './crossStorage';
import type { InitStateType } from 'zustand-tools/dist/types';
import type { PersistOptions, DevtoolsOptions } from 'zustand/middleware';
import type { StateCreator, StoreApi } from 'zustand/vanilla';

export type MiddlewareOptionType<State extends InitStateType> = (
  initializer: StateCreator<State>,
) => StateCreator<State, any, any>;

export interface CreateOptions<State extends InitStateType, Actions extends ActionsType<State>> {
  crossStorage?: CreateAsyncCrossStorageOptions;
  devtools?: boolean | DevtoolsOptions;
  middlewares?: MiddlewareOptionType<State & ReturnType<Actions>>[];
  persist?: boolean | Partial<PersistOptions<State>>;
}

export type ActionsType<State, Return = Record<string, Function>> = (
  setState: StoreApi<State>['setState'],
  getState: StoreApi<State>['getState'],
  store: StoreApi<State>,
) => Return;

export type Actions<State extends InitStateType, Actions> = ActionsType<State, Actions>;
