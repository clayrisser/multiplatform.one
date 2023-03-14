import React from 'react';
import { create } from 'zustand';
import { YStack, Text, Input } from 'tamagui';

const useMultiValueStore = create((set, get: any) => ({
  firstName: '',
  lastName: '',
  setFirstName: (name) => set({ firstName: name }),
  setLastName: (name) => set({ lastName: name }),
  getPreviousState: () => set(get().firstName),
}));

export function MultiValueComponent() {
  const name: any = useMultiValueStore();
  return (
    <YStack space>
      <Input value={name.firstName} alignSelf="center" onChange={(e) => name.setFirstName(e.nativeEvent.text)} />
      <Input value={name.lastName} alignSelf="center" onChange={(e) => name.setLastName(e.nativeEvent.text)} />
      <Text>
        {name.firstName}
        {name.lastName}
      </Text>
    </YStack>
  );
}
