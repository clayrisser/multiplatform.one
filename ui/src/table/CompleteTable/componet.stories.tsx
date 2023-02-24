import React from 'react';
import { Button, YStack, Text } from 'tamagui';

export default {
  title: 'components/checkComponent',
};

export const main = () => (
  <YStack height={500} width={50}>
    <Button height={30} width={40}>
      <Text>Hello</Text>
    </Button>
  </YStack>
);
