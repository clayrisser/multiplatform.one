import React from 'react';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { YStack, XStack, Text, XStackProps, TextProps, YStackProps } from 'tamagui';

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
          <XStack bc="$background" jc="space-evenly" {...xStack} key={i}>
            {row.map((cell: any, j: number) => {
              return (
                <Text
                  overflow="hidden"
                  whiteSpace="nowrap"
                  hoverStyle={{}}
                  minWidth={100}
                  textAlign="center"
                  alignSelf="center"
                  maxWidth={100}
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
