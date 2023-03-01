import React from 'react';
import { FancyCard } from './index';
import { Text } from 'tamagui';

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
    <Text>FancyCArd</Text>
  </FancyCard>
);
