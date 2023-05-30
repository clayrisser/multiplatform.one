import React from 'react';
import { Text } from 'tamagui';
import { LI } from './index';

export default {
  title: 'mdx/LI',
  component: LI,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <LI>
    <Text>Hello world</Text>
  </LI>
);
