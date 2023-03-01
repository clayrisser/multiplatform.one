import React from 'react';
import { FlatBubbleCard } from './index';

export default {
  title: 'ui/tamagui/FlatBubbleCard',
  component: FlatBubbleCard,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <FlatBubbleCard />;
