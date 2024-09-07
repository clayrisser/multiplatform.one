/*
 * File: /src/zustand.ts
 * Project: @multiplatform.one/zustand
 * File Created: 30-05-2024 01:07:29
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
import type { PersistOptions } from "zustand/middleware";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  Actions,
  CreateSimpleReturn,
  InitStateType,
  MiddlewareOptionType,
} from "./tools";
import { createSimple } from "./tools";
import type { CreateOptions } from "./types";

// @ts-ignore
const g: any = typeof window === "undefined" ? global : window;

export function createStateStore<
  State extends InitStateType,
  A extends Actions<State>,
>(
  name: string,
  initState: State,
  actions?: A,
  options: CreateOptions<State, A> = {},
): CreateSimpleReturn<State, A> {
  const store = createSimple(initState, {
    actions,
    middlewares: [
      ...(options.devtools === false ||
      typeof g?.__REDUX_DEVTOOLS_EXTENSION__ !== "function"
        ? []
        : ([
            (initializer) =>
              devtools(initializer, {
                name,
                enabled: true,
                ...(typeof options.devtools === "object"
                  ? options.devtools
                  : {}),
              }),
          ] as MiddlewareOptionType<State & ReturnType<A>>[])),
      (initializer) => immer(initializer),
      ...(options.persist
        ? ([
            (initializer) =>
              persist(initializer, {
                name,
                storage: createJSONStorage(() => AsyncStorage),
                ...((typeof options.persist === "object"
                  ? options.persist
                  : {}) as Partial<PersistOptions<any>>),
              }),
          ] as MiddlewareOptionType<State & ReturnType<A>>[])
        : []),
      ...(options.middlewares || []),
    ],
  });
  return store;
}
