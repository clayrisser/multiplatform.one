import React from 'react';
import { YStack, Text } from 'tamagui';

export interface TableProps {
  columns: string;
  rows: string;
}

export const TableScreen = () => {
  return (
    <YStack>
      <Text>Table</Text>
    </YStack>
  );
};
