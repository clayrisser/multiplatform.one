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
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { createUseStore } from "../src";

const sleep = (x = 100) => new Promise((res) => setTimeout(res, x));
function last<T>(arr: T[]) {
  return arr[arr.length - 1];
}

async function testSimpleStore(id: number) {
  const { getAllByTitle } = render(
    <StrictMode>
      <SimpleStoreTest id={id} />
    </StrictMode>,
  );
  const getCurrentByTitle = (name: string) => last(getAllByTitle(name))!;
  const findX = () => getCurrentByTitle("x").innerHTML;
  expect(findX()).toBe("hi");
  act(() => {
    fireEvent.click(getCurrentByTitle("add"));
  });
  expect(findX()).toBe("item-1");
  act(() => {
    fireEvent.click(getCurrentByTitle("add"));
  });
  expect(findX()).toBe("item-2");
  await act(async () => {
    fireEvent.click(getCurrentByTitle("addAsync"));
    await sleep(50);
  });
  expect(findX()).toBe("item-3");
}

describe("basic tests", () => {
  afterEach(async () => {
    cleanup();
    await AsyncStorage.clear();
  });

  it("creates a simple store and action works", async () => {
    await testSimpleStore(0);
  });

  it("creates a second store under diff namespace both work", async () => {
    await testSimpleStore(1);
    await testSimpleStore(2);
  });

  it("creates two stores under diff namespace, state is different", async () => {
    function MultiStoreUseTest() {
      const store = useStore2({ id: 0 });
      const store2 = useStore2({ id: 1 });
      return (
        <>
          <div title="x">{store.x}</div>
          <div title="x2">{store2.x}</div>
          <button
            type="button"
            title="add"
            onClick={() => {
              store.add();
            }}
          />
        </>
      );
    }
    const { getAllByTitle } = render(
      <StrictMode>
        <MultiStoreUseTest />
      </StrictMode>,
    );
    const getCurrentByTitle = (name: string) => last(getAllByTitle(name))!;
    expect(getCurrentByTitle("x").innerHTML).toBe("0");
    await act(async () => {
      fireEvent.click(getCurrentByTitle("add"));
    });
    expect(getCurrentByTitle("x").innerHTML).toBe("1");
    expect(getCurrentByTitle("x2").innerHTML).toBe("0");
  });

  it("updates a component in a different tree", async () => {
    const { getAllByTitle } = render(
      <StrictMode>
        <SimpleStoreTest id={4} />
        <SimpleStoreTest2 id={4} />
      </StrictMode>,
    );
    const getCurrentByTitle = (name: string) => last(getAllByTitle(name))!;
    act(() => {
      fireEvent.click(getCurrentByTitle("add"));
    });
    expect(getCurrentByTitle("x").innerHTML).toBe("item-1");
    expect(getCurrentByTitle("x2").innerHTML).toBe("item-1");
  });

  it("properly updates get values", () => {
    const { getAllByTitle } = render(
      <StrictMode>
        <SimpleStoreTest id={3} />
      </StrictMode>,
    );
    const findY = () => getAllByTitle("y")[0].innerHTML;
    expect(findY()).toBe("0");
    act(() => {
      fireEvent.click(getAllByTitle("add")[0]);
    });
    expect(findY()).toBe("1");
  });

  it("only re-renders tracked properties", async () => {
    let renderCount = 0;
    function SimpleStoreTestUsedProperties() {
      const store = useStore();
      renderCount++;
      return (
        <>
          <button type="button" title="add" onClick={() => store.add()} />
          <button
            type="button"
            title="changeAlt"
            onClick={() => store.changeAlt()}
          />
          <div title="alt">{store.alt}</div>
        </>
      );
    }
    const { getAllByTitle } = render(<SimpleStoreTestUsedProperties />);
    const getCurrentByTitle = (name: string) => last(getAllByTitle(name))!;
    act(() => {
      fireEvent.click(getCurrentByTitle("add"));
    });
    act(() => {
      fireEvent.click(getCurrentByTitle("add"));
    });
    act(() => {
      fireEvent.click(getCurrentByTitle("add"));
    });
    act(() => {
      fireEvent.click(getCurrentByTitle("add"));
    });
    act(() => {
      fireEvent.click(getCurrentByTitle("add"));
    });
    act(() => {
      fireEvent.click(getCurrentByTitle("changeAlt"));
    });
    expect(renderCount).toEqual(2);
  });

  it("persists state changes", async () => {
    class CounterStore {
      count = 0;
      increment() {
        this.count += 1;
      }
    }
    const usePersistedStore = createUseStore(CounterStore, {
      persist: "counter-test",
    });
    function TestComponent() {
      const store = usePersistedStore();
      if (!store) return null;
      return (
        <button
          type="button"
          onClick={() => store.increment()}
          data-testid="increment"
        >
          {store.count}
        </button>
      );
    }
    let getByTestId1: any;
    await act(async () => {
      const result = render(
        <StrictMode>
          <TestComponent />
        </StrictMode>,
      );
      getByTestId1 = result.getByTestId;
      await sleep(100);
    });
    expect(getByTestId1("increment")).toHaveTextContent("0");
    await act(async () => {
      fireEvent.click(getByTestId1("increment"));
      await sleep(100);
    });
    expect(getByTestId1("increment")).toHaveTextContent("1");
    await sleep(100);
    const stored = await AsyncStorage.getItem("tamagui-store/counter-test");
    expect(JSON.parse(stored!).state.count).toBe(1);
    cleanup();
    await sleep(100);
    let getByTestId2: any;
    await act(async () => {
      const result = render(
        <StrictMode>
          <TestComponent />
        </StrictMode>,
      );
      getByTestId2 = result.getByTestId;
      await sleep(100);
    });
    expect(getByTestId2("increment")).toHaveTextContent("1");
  });

  it("respects whitelist in persistence", async () => {
    class WhitelistStore {
      public1 = "keep";
      public2 = "drop";
      increment() {
        this.public1 = "changed";
        this.public2 = "changed";
      }
    }
    const usePersistedStore = createUseStore(WhitelistStore, {
      persist: "whitelist-test",
      whitelist: ["public1"],
    });
    function TestComponent() {
      const store = usePersistedStore();
      if (!store) return null;
      return (
        <button
          type="button"
          onClick={() => store.increment()}
          data-testid="increment"
        >
          {store.public1}|{store.public2}
        </button>
      );
    }
    let getByTestId1: any;
    await act(async () => {
      const result = render(
        <StrictMode>
          <TestComponent />
        </StrictMode>,
      );
      getByTestId1 = result.getByTestId;
      await sleep(100);
    });
    expect(getByTestId1("increment")).toHaveTextContent("keep|drop");
    await act(async () => {
      fireEvent.click(getByTestId1("increment"));
      await sleep(100);
    });
    expect(getByTestId1("increment")).toHaveTextContent("changed|changed");
    await sleep(100);
    const stored = await AsyncStorage.getItem("tamagui-store/whitelist-test");
    const state = JSON.parse(stored!).state;
    expect(state.public1).toBe("changed");
    expect(state.public2).toBe("changed");
    await AsyncStorage.clear();
    cleanup();
    // await sleep(100);
    // let getByTestId2: any;
    // await act(async () => {
    //   const result = render(
    //     <StrictMode>
    //       <TestComponent />
    //     </StrictMode>,
    //   );
    //   getByTestId2 = result.getByTestId;
    //   await sleep(100);
    // });
    // expect(getByTestId2("increment")).toHaveTextContent("changed|drop");
  });

  it("respects blacklist in persistence", async () => {
    class BlacklistStore {
      public1 = "keep";
      public2 = "drop";
      increment() {
        this.public1 = "changed";
        this.public2 = "changed";
      }
    }
    const usePersistedStore = createUseStore(BlacklistStore, {
      persist: "blacklist-test",
      blacklist: ["public2"],
    });
    function TestComponent() {
      const store = usePersistedStore();
      if (!store) return null;
      return (
        <button
          type="button"
          onClick={() => store.increment()}
          data-testid="increment"
        >
          {store.public1}|{store.public2}
        </button>
      );
    }
    let getByTestId1: any;
    await act(async () => {
      const result = render(
        <StrictMode>
          <TestComponent />
        </StrictMode>,
      );
      getByTestId1 = result.getByTestId;
      await sleep(100);
    });
    expect(getByTestId1("increment")).toHaveTextContent("keep|drop");
    await act(async () => {
      fireEvent.click(getByTestId1("increment"));
      await sleep(100);
    });
    expect(getByTestId1("increment")).toHaveTextContent("changed|changed");
    await sleep(100);
    const stored = await AsyncStorage.getItem("tamagui-store/blacklist-test");
    const state = JSON.parse(stored!).state;
    expect(state.public1).toBe("changed");
    expect(state.public2).toBeUndefined();
    // cleanup();
    // await sleep(100);
    // let getByTestId2: any;
    // await act(async () => {
    //   const result = render(
    //     <StrictMode>
    //       <TestComponent />
    //     </StrictMode>,
    //   );
    //   getByTestId2 = result.getByTestId;
    //   await sleep(100);
    // });
    // expect(getByTestId2("increment")).toHaveTextContent("changed|drop");
  });

  it("does not persist underscore properties", async () => {
    class UnderscoreStore {
      public = "keep";
      _private = "drop";
      increment() {
        this.public = "changed";
        this._private = "changed";
      }
    }
    const usePersistedStore = createUseStore(UnderscoreStore, {
      persist: "underscore-test",
    });
    function TestComponent() {
      const store = usePersistedStore();
      if (!store) return null;
      return (
        <button
          type="button"
          onClick={() => store.increment()}
          data-testid="increment"
        >
          {store.public}|{store._private}
        </button>
      );
    }
    let getByTestId1: any;
    await act(async () => {
      const result = render(
        <StrictMode>
          <TestComponent />
        </StrictMode>,
      );
      getByTestId1 = result.getByTestId;
      await sleep(100);
    });
    expect(getByTestId1("increment")).toHaveTextContent("keep|drop");
    await act(async () => {
      fireEvent.click(getByTestId1("increment"));
      await sleep(100);
    });
    expect(getByTestId1("increment")).toHaveTextContent("changed|changed");
    await sleep(100);
    const stored = await AsyncStorage.getItem("tamagui-store/underscore-test");
    const state = JSON.parse(stored!).state;
    expect(state.public).toBe("changed");
    expect(state._private).toBeUndefined();
    // cleanup();
    // await sleep(100);
    // let getByTestId2: any;
    // await act(async () => {
    //   const result = render(
    //     <StrictMode>
    //       <TestComponent />
    //     </StrictMode>,
    //   );
    //   getByTestId2 = result.getByTestId;
    //   await sleep(100);
    // });
    // expect(getByTestId2("increment")).toHaveTextContent("changed|drop");
  });
});

interface Todo {
  text: string;
  done: boolean;
}

class TodoList {
  items: Todo[] = [{ text: "hi", done: false }];
  alt = "";

  get itemsDiff() {
    return this.items.map((x, i) => i);
  }

  get lastItem() {
    return this.items[this.items.length - 1];
  }

  changeAlt() {
    this.alt = `${Math.random()}`;
  }

  add() {
    this.items = [
      ...this.items,
      { text: `item-${this.items.length}`, done: false },
    ];
  }

  async asyncAdd() {
    await sleep(20);
    this.add();
  }
}

class Store2 {
  x = 0;
  add() {
    this.x = 1;
  }
}

const useStore = createUseStore(TodoList, { persist: false });
const useStore2 = createUseStore(Store2, { persist: false });

function SimpleStoreTest(props: { id: number }) {
  const store = useStore(props);
  return (
    <>
      <div title="x">{store.lastItem.text}</div>
      <div title="y">{store.itemsDiff[store.itemsDiff.length - 1]}</div>
      <button
        type="button"
        title="add"
        onClick={() => {
          act(() => {
            store.add();
          });
        }}
      />
      <button
        type="button"
        title="addAsync"
        onClick={() => {
          act(() => {
            store.asyncAdd();
          });
        }}
      />
    </>
  );
}

function SimpleStoreTest2(props: { id: number }) {
  const store = useStore(props);
  return <div title="x2">{store.lastItem.text}</div>;
}
