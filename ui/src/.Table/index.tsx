import type { ReactNode } from 'react';
import React from 'react';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { YStack, YStackProps } from 'tamagui';

export interface TableDataProps {
  children: ReactNode;
}

export type TableProps = { yStackProps?: YStackProps } & TableDataProps;

export const Table = ({ yStackProps, ...props }: TableProps) => {
  return <YStack {...yStackProps}>{props.children}</YStack>;
};
