import React from 'react';
import { PageSeparator } from './index';
import { YStack, Text } from 'tamagui';

export default {
  title: 'app/tamagui/PageSeparator',
  component: PageSeparator,
  parameters: {
    status: { type: 'beta' },
  },
};
export const main = () => (
  <YStack alignItems="center">
    <Text>this is to test the page separator</Text>
    <PageSeparator />
    <Text paddingTop="$4">this separates the pages</Text>
  </YStack>
);
