import React from 'react';
import type { YStackProps, XStackProps } from 'tamagui';
import { YGroup, YStack, XGroup } from 'tamagui';
import { Cell } from '../cell';

type CompleteTableProps = TableProps & { yStackProps?: YStackProps } & { xStackProps?: XStackProps } & {
  tableMetaData?: React.ReactNode[];
} & { rows: React.ReactNode[][] };

interface TableProps {
  width: any;
  height: any;
  jc?: any;
  als?: any;
  borderWidth?: any;
  borderRadius?: any;
  backgroundColor?: any;
}

export function CompleteTable({
  yStackProps,
  xStackProps,
  tableMetaData,
  width,
  height,
  jc,
  als,
  borderWidth,
  borderRadius,
  backgroundColor,
  rows,
  ...props
}: CompleteTableProps) {
  const isTableMetaData: number = tableMetaData ? 1 : 0;
  const maxLength = rows.reduce((arr, val) => Math.max(arr, val.length), 0);
  const cellHeight = height / (rows?.length + isTableMetaData);
  const cellWidth = width / maxLength;

  return (
    <YStack width={width ?? width} height={height ?? height} jc={jc ?? jc} als={als ?? als} {...yStackProps}>
      <YGroup
        borderWidth={borderWidth ?? borderWidth}
        borderRadius={borderRadius ? borderRadius : '$0'}
        backgroundColor={backgroundColor ?? backgroundColor}
      >
        <XGroup borderRadius={0} backgroundColor="$backgroundStrong" {...xStackProps}>
          {tableMetaData
            ? Array.from({ length: maxLength }, (_, i) => tableMetaData[i] || null).map((item, index) => {
                return (
                  <Cell
                    key={index}
                    height={cellHeight}
                    width={cellWidth}
                    {...props}
                    borderWidth={borderWidth ?? borderWidth}
                  >
                    {item}
                  </Cell>
                );
              })
            : null}
        </XGroup>
        {rows
          ?.map((innerArray) => {
            return Array.from({ length: maxLength }, (_, i) => innerArray[i] || null);
          })
          .map((row, index) => {
            return (
              <XGroup
                key={index}
                borderRadius="$0"
                {...xStackProps}
                hoverStyle={{ scale: 1.02, backgroundColor: '$backgroundHover', borderRadius: '$0' }}
              >
                {row?.map((item, index) => {
                  return (
                    <Cell
                      key={index}
                      height={cellHeight}
                      width={cellWidth}
                      borderWidth={borderWidth ?? borderWidth}
                      {...props}
                    >
                      {item}
                    </Cell>
                  );
                })}
              </XGroup>
            );
          })}
      </YGroup>
    </YStack>
  );
}
