import React from 'react';
import type { XStackProps, TextProps } from 'tamagui';
import { XStack, Text } from 'tamagui';

export interface HeaderDataProps {
  columns: any[];
}

export type HeaderProps = { xStack?: XStackProps } & { text?: TextProps } & HeaderDataProps;

export const Header = ({ xStack, text, ...props }: HeaderProps) => {
  return (
    <XStack backgroundColor="$backgroundFocus" jc="space-evenly" {...xStack}>
      {props.columns.map((column, i) => (
        <Text minWidth={100} textAlign="center" alignSelf="center" maxWidth={100} {...text} key={i}>
          {column}
        </Text>
      ))}
    </XStack>
  );
};
