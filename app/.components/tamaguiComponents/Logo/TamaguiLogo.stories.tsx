import React from 'react';
import { TamaguiLogo } from './TamaguiLogo';

export default {
  title: 'app/tamagui/TamaguiLogo',
  component: TamaguiLogo,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <TamaguiLogo />;
