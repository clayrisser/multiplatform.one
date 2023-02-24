import React from 'react';
import { YStack, YStackProps, Text, TextProps, XStack } from 'tamagui';

export interface ColumnDataProps {
  data: any[];
  height?: number;
  width?: number;
}

export type ColumnProps = { textProps?: TextProps } & { stackProps?: YStackProps } & ColumnDataProps;

export const Column = ({ stackProps, textProps, ...props }: ColumnProps) => {
  return (
    <YStack>
      {props.data.map((val, index) => {
        return (
          <XStack {...stackProps} key={index}>
            {val.map((eachVal, i) => (
              <Text {...textProps} key={i}>
                {eachVal}
              </Text>
            ))}
          </XStack>
        );
      })}
    </YStack>
  );
};
