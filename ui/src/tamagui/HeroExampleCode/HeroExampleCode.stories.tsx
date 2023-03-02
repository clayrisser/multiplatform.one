import React from 'react';
import { HeroExampleCode } from './index';

export default {
  title: 'ui/tamagui/HeroExampleCode',
  component: HeroExampleCode,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <HeroExampleCode examples={undefined} />;
