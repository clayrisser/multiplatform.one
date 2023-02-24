import React from 'react';
import { YStackProps, XStackProps, YStack, Text } from 'tamagui';

export interface TableProps {
  columns: string;
  rows: string;
}

export const TableScreen = (TableProps) => {
  return (
    <YStack>
      <Text>Table</Text>
    </YStack>
  );
};
