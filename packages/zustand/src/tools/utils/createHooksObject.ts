/*
 * Wuif Design (https://github.com/wuifdesign).
 * Copyright (c) 2022 Wuif
 * MIT License
 */

import { useContext } from "react";
import type {
  Actions,
  CreateSimpleHooksType,
  InitStateType,
  UseBoundStoreType,
} from "../types";
import { ucFirst } from "./ucFirst";

export interface CreateHooksObjectOptions<
  State extends InitStateType,
  A extends Actions<State>,
> {
  initState: State;
  store?: UseBoundStoreType<State & ReturnType<A>>;
  StoreContext?: React.Context<UseBoundStoreType<State & ReturnType<A>>>;
}

export function createHooksObject<
  State extends InitStateType,
  A extends Actions<State>,
>({ initState, store, StoreContext }: CreateHooksObjectOptions<State, A>) {
  const hooks: Record<string, any> = {};
  for (const key of Object.keys(initState)) {
    hooks[`use${ucFirst(key)}`] = () => {
      const localStore = store || useContext(StoreContext!);
      return [
        localStore((state) => state[key]),
        localStore.getState()[`set${ucFirst(key)}`],
      ];
    };
  }
  return hooks as CreateSimpleHooksType<State>;
}
