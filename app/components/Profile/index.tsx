import React from 'react';
import { YStack, Text } from 'tamagui';
import { create } from 'zustand';

export const useStore = create(() => ({
  name: 'John',
  age: 30,
}));

export function Profile1() {
  const { name, age } = useStore();
  return (
    <YStack>
      <Text>Name: {name}</Text>
      <Text>Age: {age}</Text>
    </YStack>
  );
}
