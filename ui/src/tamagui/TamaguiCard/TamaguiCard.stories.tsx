import React from 'react';
import { TamaguiCard } from './index';

export default {
  title: 'ui/tamagui/TamaguiCard',
  component: TamaguiCard,
  parameters: { status: { type: 'beta' } },
};
export const main = () => <TamaguiCard />;
