import React from 'react';
import { HeroPerformance } from './index';

export default {
  title: 'app/tamagui/HeroPerformance',
  component: HeroPerformance,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <HeroPerformance />;
