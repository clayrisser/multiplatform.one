/*
 * Wuif Design (https://github.com/wuifdesign).
 * Copyright (c) 2022 Wuif
 * MIT License
 */

import type { StateCreator, StoreApi } from "zustand";
import { create } from "zustand";
import type {
  Actions,
  CreateSimpleOptions,
  CreateSimpleType,
  InitStateType,
} from "../types";
import { ucFirst } from "./ucFirst";

function createState(
  initState: InitStateType,
  set: StoreApi<InitStateType>["setState"],
): any {
  const state: Record<string, any> = {};
  for (const [key, value] of Object.entries(initState)) {
    state[key] = value;
    state[`set${ucFirst(key)}`] = (value: any) => set(() => ({ [key]: value }));
  }
  return state;
}

export function createStore<
  State extends InitStateType,
  A extends Actions<State>,
>(
  initState: State,
  { middlewares = [], actions }: CreateSimpleOptions<State, A> = {},
) {
  let initializer: StateCreator<CreateSimpleType<State> & ReturnType<A>> = (
    set,
    get,
    api,
  ) => ({
    ...createState(initState, set),
    ...(actions ? actions(set, get, api) : {}),
  });
  for (const middleware of middlewares) {
    initializer = middleware(initializer);
  }
  return create(initializer);
}
