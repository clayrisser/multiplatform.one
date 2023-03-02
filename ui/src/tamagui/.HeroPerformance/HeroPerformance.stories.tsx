import React from 'react';
import { HeroPerformance } from './index';

export default {
  title: 'ui/tamagui/HeroPerformance',
  component: HeroPerformance,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <HeroPerformance />;
