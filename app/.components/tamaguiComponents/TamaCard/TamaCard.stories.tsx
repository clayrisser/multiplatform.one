import React from 'react';
import { TamaCard } from './index';

export default {
  title: 'app/components/tamaguiComponents/TamaCard',
  component: TamaCard,
  parameters: { status: { type: 'beta' } },
};
export const main = () => <TamaCard />;
