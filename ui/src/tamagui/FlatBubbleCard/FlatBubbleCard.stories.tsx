import React from 'react';
import { FlatBubbleCard } from './index';
import { Text } from 'tamagui';

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
    <Text>FlatBubbleCard</Text>
  </FlatBubbleCard>
);
