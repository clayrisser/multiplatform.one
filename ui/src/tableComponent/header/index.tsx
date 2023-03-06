import React, { useEffect } from 'react';
import type { XStackProps, TextProps } from 'tamagui';
import { XStack, Text } from 'tamagui';
import { useTableStore } from '../hooks';

export interface HeaderDataProps {
  columns: any[];
}

export type HeaderProps = { xStack?: XStackProps } & { text?: TextProps } & HeaderDataProps;

export const Header = ({ xStack, text, ...props }: HeaderProps) => {
  const columnsLength: number = props.columns.length;

  const [setColumnsLength] = useTableStore((state: any) => [state.setColumnsLength]);
  useEffect(() => {
    setColumnsLength(columnsLength);
  }, [columnsLength, setColumnsLength]);

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
