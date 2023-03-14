import { YStack, Button, Text } from 'tamagui';
import React from 'react';
import { create } from 'zustand';

const useCounterStore = create((set, get: any) => ({
  count: 0,
  increment: (value: number) => set({ count: value + get().count }),
  decrement: () => set({ count: get().count - 1 }),
}));

export function Counter() {
  // const { count, increment, decrement } = useCounterStore();

  const counter: any = useCounterStore();

  return (
    <YStack space>
      <Text alignSelf="center">{counter.count}</Text>
      <Button alignSelf="center" onPress={() => counter.increment(2)}>
        Increment
      </Button>
      <Button alignSelf="center" onPress={() => counter.decrement()}>
        Decrement
      </Button>
    </YStack>
  );
}
