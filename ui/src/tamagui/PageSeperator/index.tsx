import React from 'react';
import { YStack } from 'tamagui';

export const PageSeparator = () => (
  <YStack
    mt="$3"
    mx="auto"
    als="center"
    borderBottomColor="$borderColor"
    borderBottomWidth={1}
    width={1000}
    height={0}
  />
);
