import React from 'react';
import { FancyCard } from './index';
<<<<<<< HEAD
import { Text, YStack, XStack } from 'tamagui';
=======
import { Text } from 'tamagui';
>>>>>>> c4801e81e46d7cd5ca61370396c172832f82651f

export default {
  title: 'ui/tamagui/FancyCard',
  component: FancyCard,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => (
  <FancyCard>
<<<<<<< HEAD
    <XStack space padding={10}>
      <YStack bw={2} height={250} width={210} br={4}>
        <Text>1</Text>
      </YStack>
      <YStack bw={2} height={250} width={210} br={4}>
        <Text>2</Text>
      </YStack>
      <YStack bw={2} height={250} width={210} br={4}>
        <Text>3</Text>
      </YStack>
      <YStack bw={2} height={250} width={210} br={4}>
        <Text>4</Text>
      </YStack>
      <YStack bw={2} height={250} width={210} br={4}>
        <Text>5</Text>
      </YStack>
    </XStack>
    <XStack space padding={10}>
      <YStack bw={2} height={250} width={210} br={4}>
        <Text>1</Text>
      </YStack>
      <YStack bw={2} height={250} width={210} br={4}>
        <Text>2</Text>
      </YStack>
      <YStack bw={2} height={250} width={210} br={4}>
        <Text>3</Text>
      </YStack>
      <YStack bw={2} height={250} width={210} br={4}>
        <Text>4</Text>
      </YStack>
      <YStack bw={2} height={250} width={210} br={4}>
        <Text>5</Text>
      </YStack>
    </XStack>
=======
    <Text>FancyCArd</Text>
>>>>>>> c4801e81e46d7cd5ca61370396c172832f82651f
  </FancyCard>
);
