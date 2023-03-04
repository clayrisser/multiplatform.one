import React from 'react';
import { PageSeparator } from './index';
import { YStack, Text } from 'tamagui';

export default {
  title: 'ui/tamagui/PageSeparator',
  component: PageSeparator,
  parameters: {
    status: { type: 'beta' },
  },
};
export const main = () => (
  <YStack ai="center">
    <Text>this is to test the page separator</Text>
    <PageSeparator />
    <Text pt="$4">this separates the pages</Text>
  </YStack>
);
