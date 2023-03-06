import React from 'react';
import { TamaguiLogo } from './TamaguiLogo';

export default {
  title: 'app/tamaguiComponents/TamaguiLogo',
  component: TamaguiLogo,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <TamaguiLogo />;
