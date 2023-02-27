import React from 'react';

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

  return (
    <YStack space {...yStack}>
      {rows.map((row: any, i: number) => {
        return (
          <XStack bc="$background" jc="space-between" {...xStack} key={i}>
            {row.map((cell: any, j: number) => {
              return (
                <Text
                  // overflow="hidden"
                  // whiteSpace="nowrap"
                  // textOverflow="ellipsis"
                  hoverStyle={{}}
                  textAlign="center"
                  alignSelf="center"
                  width="100%"
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
