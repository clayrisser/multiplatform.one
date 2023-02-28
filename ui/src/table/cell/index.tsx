import type { YStackProps } from 'tamagui';
import { YStack } from 'tamagui';
import React from 'react';

type CellProps = YStackProps;

export function Cell({ children, ...Props }: CellProps) {
  return (
    <YStack jc="center" ai="center" {...Props}>
      {children}
    </YStack>
  );
}
