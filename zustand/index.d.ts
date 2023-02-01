/**
 * File: /zustand/index.d.ts
 * Project: multiplatform.one
 * File Created: 01-02-2023 14:09:56
 * Author: Clay Risser
 * -----
 * Last Modified: 01-02-2023 14:10:39
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

import { InitStateType } from 'zustand-tools/dist/types';
import { StateCreator, StoreApi } from 'zustand';
import { PersistOptions, DevtoolsOptions } from 'zustand/middleware';
type MiddlewareOptionType<State extends InitStateType> = (
  initializer: StateCreator<State>,
) => StateCreator<State, any, any>;
interface CreateOptions<State extends InitStateType, Actions extends ActionsType<State>> {
  middlewares?: MiddlewareOptionType<State & ReturnType<Actions>>[];
  persist?: boolean | Partial<PersistOptions<State>>;
  devtools?: boolean | DevtoolsOptions;
}
type ActionsType<State, Return = Record<string, Function>> = (
  setState: StoreApi<State>['setState'],
  getState: StoreApi<State>['getState'],
  store: StoreApi<State>,
) => Return;
export declare function createStateStore<State extends InitStateType, Actions extends ActionsType<State>>(
  name: string,
  initState: State,
  actions?: Actions,
  options?: CreateOptions<State, Actions>,
): {
  useStore: import('zustand').UseBoundStore<
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
  } & import('zustand-tools/dist/types').CreateSimpleHooksType<State>;
};
export type Actions<State extends InitStateType, Actions> = ActionsType<State, Actions>;
export {};
