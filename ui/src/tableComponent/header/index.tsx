import React, { useEffect } from 'react';
import type { XStackProps, TextProps } from 'tamagui';
import { XStack, H6 } from 'tamagui';
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
        <H6
          textAlign="center"
          alignSelf="center"
          flexWrap="wrap"
          padding="$1"
          borderLeftWidth={i === 0 ? 0 : 2}
          als="stretch"
          width="100%"
          {...text}
          key={i}
        >
          {column}
        </H6>
      ))}
    </XStack>
  );
};
