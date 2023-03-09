import type { ReactNode } from 'react';
import React, { useEffect } from 'react';
import { useTableStore } from '../hooks';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ScrollView, YStackProps } from 'tamagui';
import { YStack } from 'tamagui';
export interface TableDataProps {
  children: ReactNode;
}

export type TableProps = { yStack?: YStackProps } & TableDataProps;

export const Table = ({ yStack, ...props }: TableProps) => {
  const { children } = props;

  const [headerColumnsWidth, rowsWidths, eachColumnWidth, setEachColumnWidth] = useTableStore((state: any) => [
    state.headerColumnsWidth,
    state.rowsWidths,
    state.eachColumnWidth,
    state.setEachColumnWidth,
  ]);

  console.log('headerColumnsWidth', headerColumnsWidth);
  console.log('rowsWidths', rowsWidths);

  useEffect(() => {
    if (rowsWidths !== null && headerColumnsWidth !== null) {
      const newEachColumnWidth = headerColumnsWidth.map((columnWidth: number, index: number) => {
        const columnRowsWidth = rowsWidths.map((rowWidths: number[]) => rowWidths[index]);
        const maxColumnRowWidth = Math.max(...columnRowsWidth);
        return Math.max(columnWidth, maxColumnRowWidth);
      });
      setEachColumnWidth(newEachColumnWidth);
    }
  }, [headerColumnsWidth, rowsWidths]);

  console.log('eachColumnWidth', eachColumnWidth);

  return (
    <YStack jc="center">
      <ScrollView horizontal={true} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <YStack borderWidth="$1" {...yStack}>
          {children}
        </YStack>
      </ScrollView>
    </YStack>
  );
};
