import React from 'react';
import { TintSection } from './index';

export default {
  title: 'app/tamaguiComponents/TintSection',
  component: TintSection,
  parameters: { status: { type: 'beta' } },
};
export const main = () => <TintSection index={0}> Tint Section Component </TintSection>;
