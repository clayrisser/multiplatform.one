/* eslint-disable @typescript-eslint/consistent-type-imports */
import { YStack, YStackProps } from 'tamagui';
import React from 'react';

type CellProps = YStackProps;

export function Cell({ children, ...Props }: CellProps) {
  return (
    <YStack jc="center" ai="center" {...Props}>
      {children}
    </YStack>
  );
}
