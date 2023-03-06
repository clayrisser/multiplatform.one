import React from 'react';
import { useTableStore } from '../hooks';

import type { XStackProps, TextProps, YStackProps } from 'tamagui';
import { YStack, XStack, Text } from 'tamagui';

export interface RowsDataProps {
  rows: any[][];
}

export type RowsProps = { xStack?: XStackProps } & { text?: TextProps } & {
  yStack?: YStackProps;
} & RowsDataProps;

export const Rows = ({ xStack, text, yStack, ...props }: RowsProps) => {
  const { rows } = props;
  const [columnsLength] = useTableStore((state: any) => [state.columnsLength]);

  const filteredRow = rows.map((row) => {
    if (columnsLength < row.length) {
      return [...row];
    } else {
      const diff = columnsLength - row.length;
      const emptyCells = Array.from({ length: diff }).fill('');
      return [...row, ...emptyCells];
    }
  });

  return (
    <YStack space {...yStack}>
      {filteredRow.map((row: any, i: number) => {
        return (
          <XStack bc="$background" jc="space-around" {...xStack} key={i}>
            {row.map((cell: any, j: number) => {
              return (
                <Text
                  // overflow="hidden"
                  // whiteSpace="nowrap"
                  // textOverflow="ellipsis"
                  hoverStyle={{}}
                  width="100%"
                  textAlign="center"
                  alignSelf="center"
                  flexWrap="wrap"
                  padding={10}
                  key={j}
                  {...text}
                >
                  {cell}
                </Text>
              );
            })}
          </XStack>
        );
      })}
    </YStack>
  );
};
