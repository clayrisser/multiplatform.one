import React from 'react';
import type { Meta } from '@storybook/react';
import { YStack, Circle } from 'tamagui';

const meta: Meta = {
  title: 'animations',
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <YStack
    ai="center"
    jc="center"
    w={400}
    h={400}
    bg="$blue5"
    animation="bouncy"
    hoverStyle={{
      rotate: '20deg',
      scale: 1.5,
    }}
    pressStyle={{
      rotate: '20deg',
      scale: 1.5,
    }}
  >
    <Circle
      enterStyle={{
        bg: '$green10',
      }}
      hoverStyle={{
        bg: '$green10',
      }}
      pressStyle={{
        bg: '$purple10',
        skewX: '10deg',
      }}
      animation="bouncy"
      w={200}
      h={200}
      bg="$red10"
    />
  </YStack>
);

export default meta;
