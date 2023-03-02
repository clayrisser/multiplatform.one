import React from 'react';
import { HeroExampleAnimations } from './index';

export default {
  title: 'ui/tamagui/HeroExampleAnimations',
  component: HeroExampleAnimations,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <HeroExampleAnimations animationCode={undefined} />;
