import React from 'react';
import type { XStackProps, TextProps } from 'tamagui';
import { Text, XStack } from 'tamagui';

export interface RowDataProps {
  row: any[];
}

export type RowProps = { xStack?: XStackProps } & { text?: TextProps } & RowDataProps;
export const Row = ({ xStack, text, ...props }: RowProps) => {
  return (
    <XStack bc="$background" jc="space-around" {...xStack}>
      {props.row.map((cell: any, i: number) => (
        <Text padding={10} width="100%" flexWrap="wrap" textAlign="center" alignSelf="center" {...text} key={i}>
          {cell}
        </Text>
      ))}
    </XStack>
  );
};
