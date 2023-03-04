import React from 'react';
import { HeroBelow } from './index';

export default {
  title: 'app/tamagui/HeroBelow',
  component: HeroBelow,
  parameters: { status: { type: 'beta' } },
};

export const Default = () => <HeroBelow />;
