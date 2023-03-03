import React from 'react';
import { FlatBubbleCard } from './index';
import { Text, YStack, XStack } from 'tamagui';

export default {
  title: 'ui/tamagui/FlatBubbleCard',
  component: FlatBubbleCard,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => (
  <FlatBubbleCard>
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
  </FlatBubbleCard>
);
