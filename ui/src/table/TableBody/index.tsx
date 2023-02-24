import React from 'react';
import type { YStackProps, XStackProps, TextProps } from 'tamagui';
import { YGroup, XStack, Text } from 'tamagui';

export type TableBodyProps = YStackProps & { rowStyle?: XStackProps } & { rowDataStyle?: TextProps } & {
  row: string[][];
};

// export interface TableBodyData {
//   rowData: string[];
// }

export function TableBody({ row, rowStyle, rowDataStyle }: TableBodyProps) {
  return (
    <YGroup>
      {row.map((item, index) => {
        return (
          <XStack {...rowStyle} key={index}>
            {item.map((column, i) => {
              return (
                <Text key={i} {...rowDataStyle}>
                  {column}
                </Text>
              );
            })}
          </XStack>
        );
      })}
    </YGroup>
  );
}
