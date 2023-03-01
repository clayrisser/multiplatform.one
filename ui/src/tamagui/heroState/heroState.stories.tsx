import React from 'react';
import { useHeroHovered } from './index';

export default {
  title: 'ui/tamagui/useHeroHovered',
  component: useHeroHovered,
  parameters: { status: { type: 'beta' } },
};
export const main = () => <useHeroHovered />;
