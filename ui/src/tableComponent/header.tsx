import React from 'react';
import type { XStackProps, TextProps } from 'tamagui';
import { XStack, Text } from 'tamagui';

export interface HeaderDataProps {
  columns: any[];
}

export type HeaderProps = { xStack?: XStackProps } & { text?: TextProps } & HeaderDataProps;

export const Header = ({ xStack, text, ...props }: HeaderProps) => {
  return (
    <XStack backgroundColor="$backgroundFocus" jc="space-around" {...xStack}>
      {props.columns.map((column, i) => (
        <Text padding={10} width="100%" flexWrap="wrap" textAlign="center" alignSelf="center" {...text} key={i}>
          {column}
        </Text>
      ))}
    </XStack>
  );
};
