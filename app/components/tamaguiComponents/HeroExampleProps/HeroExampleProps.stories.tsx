import React from 'react';
import { HeroExampleProps } from './index';

export default {
  title: 'app/tamaguiComponents/HeroExampleProps',
  component: HeroExampleProps,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <HeroExampleProps />;
