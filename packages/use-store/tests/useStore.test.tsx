/**
 * File: /tests/useStore.test.tsx
 * Project: @multiplatform.one/use-store
 * File Created: 29-12-2024 07:26:47
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
import { act, renderHook } from "@testing-library/react";
import * as React from "react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { createUseStore } from "../src";
import { TestStore } from "./TestStore";

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return <React.StrictMode>{children}</React.StrictMode>;
};

describe("createUseStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (AsyncStorage.getItem as Mock).mockResolvedValue(null);
  });

  it("should create a store with initial state", async () => {
    const useStore = createUseStore(TestStore);
    const { result } = renderHook(() => useStore(), { wrapper });
    expect(result.current).toBeDefined();
    expect(result.current?.state.count).toBe(0);
  });

  it("should update state", async () => {
    const useStore = createUseStore(TestStore);
    const { result } = renderHook(() => useStore(), { wrapper });
    expect(result.current).toBeDefined();
    await act(async () => {
      result.current?.setState({ count: 1 });
    });
    expect(result.current?.state.count).toBe(1);
  });

  it("should persist state to AsyncStorage", async () => {
    const useStore = createUseStore(TestStore, { persist: true });
    const { result } = renderHook(() => useStore(), { wrapper });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    expect(result.current).toBeDefined();
    expect(result.current?.state.count).toBe(0);
    await act(async () => {
      result.current?.setState({ count: 1 });
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    expect(result.current?.state.count).toBe(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "tamagui-store/TestStore",
      JSON.stringify({ state: { state: { count: 1 } } }),
    );
  });

  it("should load persisted state from AsyncStorage", async () => {
    (AsyncStorage.getItem as Mock).mockResolvedValue(
      JSON.stringify({ state: { state: { count: 5 } } }),
    );
    const useStore = createUseStore(TestStore, { persist: true });
    const { result } = renderHook(() => useStore(), { wrapper });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    expect(result.current).toBeDefined();
    expect(result.current?.state.count).toBe(5);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      "tamagui-store/TestStore",
    );
  });
});
