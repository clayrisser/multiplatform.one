import React from 'react';
import type { XStackProps, TextProps } from 'tamagui';
import { Text, XStack } from 'tamagui';

export interface RowDataProps {
  row: any[];
}

export type RowProps = { xStack?: XStackProps } & { text?: TextProps } & RowDataProps;
export const Row = ({ xStack, text, ...props }: RowProps) => {
  return (
    <XStack bc="$background" jc="space-evenly" {...xStack}>
      {props.row.map((cell: any, i: number) => (
        <Text padding={10} minWidth={100} textAlign="center" alignSelf="center" maxWidth={100} {...text} key={i}>
          {cell}
        </Text>
      ))}
    </XStack>
  );
};
