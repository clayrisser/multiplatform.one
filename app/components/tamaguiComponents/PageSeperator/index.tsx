import React from 'react';
import { YStack } from 'tamagui';

export const PageSeparator = () => (
  <YStack
    marginTop="$3"
    marginHorizontal="auto"
    alignSelf="center"
    borderBottomColor="$borderColor"
    borderBottomWidth={1}
    width={1000}
    height={0}
  />
);
