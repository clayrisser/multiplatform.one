import React from 'react';
import { TamaCard } from './index';
import { Text } from 'tamagui';

export default {
  title: 'app/tamaguiComponents/TamaCard',
  component: TamaCard,
  parameters: { status: { type: 'beta' } },
};
export const main = () => (
  <TamaCard>
    {' '}
    <Text> TamaCard Component </Text>
  </TamaCard>
);
