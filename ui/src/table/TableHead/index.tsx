import React from 'react';
import type { YStackProps, XStackProps, TextProps } from 'tamagui';
import { Text, XStack } from 'tamagui';

export interface TableHeadData {
  children?: React.ReactNode;
  label: string[];
}

export type TableHeadProps = YStackProps & { headRowStyle?: XStackProps } & TableHeadData & {
    headTextStyle?: TextProps;
  };

export function TableHead({ label, headTextStyle, headRowStyle }: TableHeadProps) {
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
