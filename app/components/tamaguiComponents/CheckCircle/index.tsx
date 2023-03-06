import { Check } from '@tamagui/lucide-icons';
import React from 'react';
import { YStack } from 'tamagui';

export const CheckCircle = () => (
  <YStack
    marginTop={2}
    backgroundColor="$backgroundHover"
    width={40}
    height={40}
    alignItems="center"
    justifyContent="center"
    borderRadius={100}
    marginRight="$2.5"
  >
    <Check size={12} color="var(--colorHover)" />
  </YStack>
);
