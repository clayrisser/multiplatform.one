import React from 'react';
import { NotoIcon } from './index';
import { Text, YStack } from 'tamagui';

export default {
  title: 'ui/tamagui/NotoIcon',
  component: NotoIcon,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => (
  <YStack>
    <NotoIcon backgroundColor="$blue10" fontSize={50} width={300}>
      IamAngry
      <Text bc="$red10">I am ANgry ueuwfs dii iijfweif i</Text>
    </NotoIcon>
    <YStack width={250} bc="yellow">
      <Text>hnjhjkjkdsjkfdsjfjdsfjdsfjdsjfdijjdjifijjijijijiju</Text>
    </YStack>
  </YStack>
);
