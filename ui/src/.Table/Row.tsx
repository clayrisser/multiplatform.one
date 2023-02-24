import React from 'react';
import type { TextProps, XStackProps } from 'tamagui';
import { XStack, Text } from 'tamagui';

export interface RowDataProps {
  data: any[];
}

export type RowProps = { textProps?: TextProps } & { xStackProps?: XStackProps } & RowDataProps;

export const Row = ({ textProps, xStackProps, ...props }: RowProps) => {
  return (
    <XStack {...xStackProps}>
      {props.data.map((val, index) =>
        val.map((eachVal, i) => (
          <Text {...textProps} key={index}>
            {eachVal}
          </Text>
        )),
      )}
    </XStack>
  );
};
