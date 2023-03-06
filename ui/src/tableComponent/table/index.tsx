import type { ReactNode } from 'react';
import React from 'react';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ScrollView, YStackProps } from 'tamagui';
import { YStack } from 'tamagui';
export interface TableDataProps {
  children: ReactNode;
}

export type TableProps = { yStack?: YStackProps } & TableDataProps;

export const Table = ({ yStack, ...props }: TableProps) => {
  const { children } = props;
  return (
    <YStack>
      <ScrollView horizontal={true} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <YStack borderWidth="$1" {...yStack}>
          {children}
        </YStack>
      </ScrollView>
    </YStack>
  );
};
