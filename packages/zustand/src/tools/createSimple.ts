/*
 * Wuif Design (https://github.com/wuifdesign).
 * Copyright (c) 2022 Wuif
 * MIT License
 */

import shallow from 'zustand/shallow';
import type { InitStateType, Actions, CreateSimpleOptions, Hooks, UseStore } from './types';
import { createHooksObject, createStore, filterObjectByKey } from './utils';

export function createSimple<State extends InitStateType, A extends Actions<State>>(
  initState: State,
  options: CreateSimpleOptions<State, A> = {},
): CreateSimpleReturn<State, A> {
  const useStore = createStore(initState, options);
  return {
    useStore,
    hooks: {
      useAllData: () => useStore((state) => filterObjectByKey(state, (key) => !key.startsWith('set')), shallow),
      ...createHooksObject<State, A>({ initState, store: useStore }),
    },
  };
}

export interface CreateSimpleReturn<State extends InitStateType, A extends Actions<State>> {
  useStore: UseStore<State, A>;
  hooks: Hooks<State>;
}
