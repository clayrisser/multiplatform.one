import React from 'react';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { XStack, Text, XStackProps, TextProps } from 'tamagui';

export interface HeaderDataProps {
  columns: any[];
}

export type HeaderProps = { xStack?: XStackProps } & { text?: TextProps } & HeaderDataProps;

export const Header = ({ xStack, text, ...props }: HeaderProps) => {
  return (
    <XStack backgroundColor="$backgroundFocus" jc="space-evenly" {...xStack}>
      {props.columns.map((column, i) => (
        <Text padding={10} minWidth={100} textAlign="center" alignSelf="center" maxWidth={100} {...text} key={i}>
          {column}
        </Text>
      ))}
    </XStack>
  );
};
