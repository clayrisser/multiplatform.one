import React from 'react';
import type { YStackProps, XStackProps, TextProps } from 'tamagui';
import { YGroup, XStack, Text } from 'tamagui';

// export type TableBodyProps = YStackProps & { rowStyle?: XStackProps } & { rowDataStyle?: TextProps } & {
//   row: string[][];
// };

export type TableScreenProps = YStackProps & { rowStyle?: XStackProps } & { rowDataStyle?: TextProps } & {
  row: string[][];
  flexArr?: number[];
};

export function TableScreen({ row, rowStyle, rowDataStyle }: TableScreenProps) {
  return (
    <YGroup animation="quick" hoverStyle={{ animation: 'bouncy' }}>
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
