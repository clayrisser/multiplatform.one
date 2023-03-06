import React from 'react';
import type { YStackProps } from 'tamagui';
import { YStack } from 'tamagui';

export const Preview = (props: YStackProps) => (
  <YStack
    data-preview
    margin={0}
    overflow="visible"
    borderWidth={1}
    borderColor="$borderColor"
    borderTopLeftRadius="$3"
    borderTopRightRadius="$3"
    marginBottom="$-3"
    padding="$3"
    paddingBottom="$4"
    position="relative"
    alignItems="flex-start"
    {...props}
  />
);
