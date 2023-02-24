import React from 'react';
import type { YStackProps, TextProps, XStackProps } from 'tamagui';
import { YStack, Text, XStack, YGroup } from 'tamagui';

export interface TableDataProps {
  headerData: any[];
  rowData: any[][];
  //   columnData: any[][];
  //   children?: React.ReactNode;
}

export type TableProps = TableDataProps & { rowStyle?: XStackProps } & { rowDataStyle?: TextProps } & {
  columnStyle?: YStackProps;
} & { columnDataStyle?: TextProps } & { headerStyle?: XStackProps } & { headerDataStyle?: TextProps };

export const Table = ({
  headerDataStyle,
  headerStyle,
  rowStyle,
  rowDataStyle,
  columnStyle,
  columnDataStyle,
  ...props
}: TableProps) => {
  function renderHeader() {
    return (
      <XStack jc="space-evenly" {...headerStyle}>
        {props.headerData.map((val, _) =>
          val.map((eachVal, i) => (
            <Text key={i} {...headerDataStyle}>
              {eachVal}
            </Text>
          )),
        )}
      </XStack>
    );
  }

  function renderRow() {
    return (
      <YStack>
        {props.rowData.map((val, index) => {
          return (
            <XStack key={index} {...rowStyle}>
              {val.map((eachVal, i) => {
                return (
                  <Text key={i} {...rowDataStyle} minWidth={100} maxWidth={100}>
                    {eachVal}
                  </Text>
                );
              })}
            </XStack>
          );
        })}
      </YStack>
    );
  }

  return (
    <YStack>
      {renderHeader()}
      {renderRow()}
    </YStack>
  );
};
