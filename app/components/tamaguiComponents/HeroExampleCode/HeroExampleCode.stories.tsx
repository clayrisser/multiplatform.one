import React from 'react';
import { HeroExampleCode } from './index';

export default {
  title: 'app/tamagui/HeroExampleCode',
  component: HeroExampleCode,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => (
  <HeroExampleCode examples={[{ name: 'FlyingFox Labs', location: 'Hyderabad' }]} onlyDemo={true} />
);