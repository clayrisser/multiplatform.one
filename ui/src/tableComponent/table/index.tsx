import type { ReactNode } from 'react';
import React from 'react';
import type { YStackProps } from 'tamagui';
import { YStack } from 'tamagui';
export interface TableDataProps {
  children: ReactNode;
}

export type TableProps = { yStack?: YStackProps } & TableDataProps;

export const Table = ({ yStack, ...props }: TableProps) => {
  const { children } = props;
  return (
    <YStack borderWidth="$1" {...yStack}>
      {children}
    </YStack>
  );
};
