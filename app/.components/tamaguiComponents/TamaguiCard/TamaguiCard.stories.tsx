import React from 'react';
import { TamaguiCard } from './index';

export default {
  title: 'app/components/tamaguiComponents/TamaguiCard',
  component: TamaguiCard,
  parameters: { status: { type: 'beta' } },
};
export const main = () => (
  <TamaguiCard title={undefined} subTitle={undefined}>
    TamagUi Card
  </TamaguiCard>
);
