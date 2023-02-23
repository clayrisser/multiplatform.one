/* eslint-disable @typescript-eslint/consistent-type-imports */
import { YGroup, YStack, XStack, YStackProps, XStackProps, TextProps, Text } from 'tamagui';
import React from 'react';

export type TableBodyProps = YStackProps & { rowStyle?: XStackProps } & { rowDataStyle?: TextProps } & {
  row: string[][];
};

// export interface TableBodyData {
//   rowData: string[];
// }

export function TableBody({ row, rowStyle, rowDataStyle, ...props }: TableBodyProps) {
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
