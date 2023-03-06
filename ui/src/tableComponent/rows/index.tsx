import React from 'react';
import { useTableStore } from '../hooks';

import type { XStackProps, TextProps, YStackProps } from 'tamagui';
import { YStack, XStack, Paragraph } from 'tamagui';

export interface RowsDataProps {
  rows: any[][];
  emptyValue?: string;
}

export type RowsProps = { xStack?: XStackProps } & { text?: TextProps } & {
  yStack?: YStackProps;
} & RowsDataProps;

export const Rows = ({ xStack, text, yStack, ...props }: RowsProps) => {
  const { rows, emptyValue } = props;
  const [columnsLength, cellHeight, setCellHeight] = useTableStore((state: any) => [
    state.columnsLength,
    state.cellHeight,
    state.setCellHeight,
  ]);

  const filteredRow = rows.map((row) => {
    if (columnsLength < row.length) {
      return [...row];
    } else {
      const diff = columnsLength - row.length;
      const emptyCells = Array.from({ length: diff }).fill(emptyValue || '');
      return [...row, ...emptyCells];
    }
  });

  React.useEffect(() => {
    let heightArr: any[] = [];

    for (let i = 0; i < filteredRow.length; i++) {
      for (let j = 0; j < filteredRow[i].length; j++) {
        const height = document.getElementById(`text${i}${j}`)?.clientHeight;
        heightArr.push(height);
      }
    }
    const maxHeight = Math.max(...heightArr);
    setCellHeight(maxHeight);
  }, []);

  console.log('cellHeight', cellHeight);

  return (
    <YStack {...yStack}>
      {filteredRow.map((row: any, i: number) => {
        return (
          <XStack
            borderTopWidth={filteredRow.length === i ? 0 : 2}
            bc="$background"
            jc="space-around"
            {...xStack}
            key={i}
          >
            {row.map((cell: any, j: number) => {
              return (
                <Paragraph
                  // overflow="hidden"
                  // whiteSpace="nowrap"
                  // textOverflow="ellipsis"
                  // minHeight={cellHeight}
                  id={`text${i}${j}`}
                  hoverStyle={{}}
                  width="100%"
                  textAlign="center"
                  alignSelf="center"
                  flexWrap="wrap"
                  padding="$1"
                  key={j}
                  borderLeftWidth={j === 0 ? 0 : 2}
                  als="stretch"
                  {...text}
                >
                  {cell}
                </Paragraph>
              );
            })}
          </XStack>
        );
      })}
    </YStack>
  );
};
