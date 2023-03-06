import React from 'react';
import { unwrapText } from './index';
import { YStack, Text } from 'tamagui';

export default {
  title: 'app/components/tamaguiComponents/unwrapText',
  component: unwrapText,
  parameters: { status: { type: 'beta' } },
};
export const main = () => (
  <YStack>
    <Text>{unwrapText('Hello this is from unwrapText component')}</Text>
  </YStack>
);
