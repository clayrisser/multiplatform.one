import React from 'react';
import { EnsureFlexed, YStack } from 'tamagui';

export const HR = () => (
  <YStack marginVertical="$10" marginHorizontal="auto" maxWidth="50%">
    <EnsureFlexed />
    <YStack borderBottomColor="$red8Dark" borderBottomWidth={1} flex={1} />
  </YStack>
);
