/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Text, XStack, YStackProps, XStackProps, TextProps } from 'tamagui';
import React from 'react';

export interface TableHeadData {
  children?: React.ReactNode;
  label: string[];
}

export type TableHeadProps = YStackProps & { headRowStyle?: XStackProps } & TableHeadData & {
    headTextStyle?: TextProps;
  };

export function TableHead({ label, children, headTextStyle, headRowStyle, ...props }: TableHeadProps) {
  return (
    <XStack jc="space-evenly" {...headRowStyle}>
      {label.map((item, index) => {
        return (
          <Text key={index} {...headTextStyle}>
            {item}
          </Text>
        );
      })}
    </XStack>
  );
}
