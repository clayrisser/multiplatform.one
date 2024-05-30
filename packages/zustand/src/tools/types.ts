/*
 * Wuif Design (https://github.com/wuifdesign).
 * Copyright (c) 2022 Wuif
 * MIT License
 */

import type { StateCreator, StoreApi, UseBoundStore } from 'zustand';

export type MiddlewareOptionType<State extends InitStateType> = (
  initializer: StateCreator<State>,
) => StateCreator<State, any, any>;

export type CreateSimpleType<State extends { [key: string | number | symbol]: any }> = State & {
  [Property in keyof State as `set${Capitalize<string & Property>}`]: (value: State[Property]) => void;
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type InitStateType = Record<string, any>;

export type MiddlewareType<State> = (
  config: StateCreator<State>,
  options: any,
) => (set: StoreApi<State>['setState'], get: StoreApi<State>['getState'], api: StoreApi<State>) => State;

export type UseBoundStoreType<State extends InitStateType> = UseBoundStore<StoreApi<CreateSimpleType<State>>>;

export type CreateSimpleHooksType<State extends { [key: string | number | symbol]: any }> = {
  [Property in keyof State as `use${Capitalize<string & Property>}`]: () => [
    State[Property],
    (value: State[Property]) => void,
  ];
};

export type Actions<State> = (
  setState: StoreApi<State>['setState'],
  getState: StoreApi<State>['getState'],
  store: StoreApi<State>,
) => Record<string, Function>;

export interface CreateSimpleOptions<State extends InitStateType, A extends Actions<State>> {
  actions?: A;
  middlewares?: MiddlewareOptionType<State & ReturnType<A>>[];
}

export type UseStore<State extends InitStateType, A extends Actions<State>> = UseBoundStore<
  StoreApi<
    State & {
      [Property in keyof State as `set${Capitalize<string & Property>}`]: (value: State[Property]) => void;
    } & ReturnType<A>
  >
>;

export type Hooks<State extends InitStateType> = {
  useAllData: () => {
    [k: string]: any;
  };
} & CreateSimpleHooksType<State>;
