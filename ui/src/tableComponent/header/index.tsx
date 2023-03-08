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

  const [setColumnsLength, setHeaderColumnsWidth, headerColumnsWidth] = useTableStore((state: any) => [
    state.setColumnsLength,
    state.setHeaderColumnsWidth,
    state.headerColumnsWidth,
  ]);
  useEffect(() => {
    setColumnsLength(columnsLength);
  }, [columnsLength, setColumnsLength]);

  useEffect(() => {
    const columnWidthArray: any[] = [];
    for (let i = 0; i < props.columns.length; i++) {
      const columnWidth = document.getElementById(`column${i}`)?.clientWidth;
      columnWidthArray.push(columnWidth);
      setHeaderColumnsWidth(columnWidthArray);
    }
  }, [props.columns, setHeaderColumnsWidth]);

  return (
    <XStack backgroundColor="$backgroundFocus" jc="space-around" {...xStack}>
      {props.columns.map((column, i) => (
        <H6
          id={`column${i}`}
          overflow="hidden"
          // whiteSpace="nowrap"
          textOverflow="ellipsis"
          textAlign="center"
          alignSelf="center"
          flexWrap="wrap"
          padding="$1"
          borderLeftWidth={i === 0 ? 0 : 2}
          als="stretch"
          {...text}
          key={i}
        >
          {column}
        </H6>
      ))}
    </XStack>
  );
};
