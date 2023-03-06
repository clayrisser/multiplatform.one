import React from 'react';
import { HeroExampleProps } from './index';

export default {
  title: 'app/tamagui/HeroExampleProps',
  component: HeroExampleProps,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <HeroExampleProps />;
