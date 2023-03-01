import React from 'react';
import { FancyCard } from './index';

export default {
  title: 'ui/tamagui/FancyCard',
  component: FancyCard,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <FancyCard />;
