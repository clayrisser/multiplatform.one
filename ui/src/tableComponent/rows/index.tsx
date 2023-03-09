import React, { useEffect, useState } from 'react';
import { useTableStore } from '../hooks';
import type { XStackProps, TextProps, YStackProps } from 'tamagui';
import { YStack, XStack, Paragraph } from 'tamagui';
import { Platform } from 'react-native';

export interface RowsDataProps {
  rows: any[][];
  emptyValue?: string;
}

export type RowsProps = { xStack?: XStackProps } & { text?: TextProps } & {
  yStack?: YStackProps;
} & RowsDataProps;

export const Rows = ({ xStack, text, yStack, ...props }: RowsProps) => {
  const { rows, emptyValue } = props;
  const [columnsLength, setRowsWidths, rowsWidths, eachColumnWidth] = useTableStore((state: any) => [
    state.columnsLength,
    state.setRowsWidths,
    state.rowsWidths,
    state.eachColumnWidth,
  ]);

  const [filteredRow, setFilteredRow] = useState(rows);
  let handelLayout: any;
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const rowsWidthArray: any[] = [];

      for (let i = 0; i < filteredRow.length; i++) {
        const rowWidthArray: any[] = [];
        for (let j = 0; j < filteredRow[i].length; j++) {
          let rowWidth;

          Platform.OS === 'web'
            ? (rowWidth = document.getElementById(`text${i}${j}`)?.clientWidth)
            : (handelLayout = (e) => {
                rowWidth = e.nativeEvent.layout.width;
              });

          rowWidthArray.push(rowWidth);
        }
        rowsWidthArray.push(rowWidthArray);
      }
      setRowsWidths(rowsWidthArray);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [filteredRow, setRowsWidths]);

  useEffect(() => {
    setFilteredRow(
      rows.map((row) => {
        if (columnsLength < row.length) {
          return [...row];
        } else {
          const diff = columnsLength - row.length;
          const emptyCells = Array.from({ length: diff }).fill(emptyValue || '');
          return [...row, ...emptyCells];
        }
      }),
    );
  }, [rows, columnsLength, emptyValue]);

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
                  onLayout={handelLayout}
                  minWidth={eachColumnWidth !== null ? eachColumnWidth[j] + 0 : 0}
                  maxWidth={300}
                  id={`text${i}${j}`}
                  hoverStyle={{}}
                  textAlign="center"
                  alignSelf="center"
                  flexWrap="wrap"
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
