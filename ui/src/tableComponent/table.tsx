// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import React, { ReactNode } from 'react';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { YStack, YStackProps } from 'tamagui';
export interface TableDataProps {
  children: ReactNode;
}

export type TableProps = { yStack?: YStackProps } & TableDataProps;

export const Table = ({ yStack, ...props }: TableProps) => {
  const { children } = props;
  return (
    <YStack space {...yStack}>
      {children}
    </YStack>
  );
};
