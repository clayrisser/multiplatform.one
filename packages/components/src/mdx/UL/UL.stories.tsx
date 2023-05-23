import React from 'react';
import { Text } from 'tamagui';
import { UL } from './index';

export default {
  title: 'mdx/UL',
  component: UL,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <UL>
    <Text>Hello world</Text>
  </UL>
);
