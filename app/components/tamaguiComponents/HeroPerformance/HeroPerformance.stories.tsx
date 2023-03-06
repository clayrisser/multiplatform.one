import React from 'react';
import { HeroPerformance } from './index';

export default {
  title: 'app/tamaguiComponents/HeroPerformance',
  component: HeroPerformance,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <HeroPerformance />;
