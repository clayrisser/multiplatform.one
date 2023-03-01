import React from 'react';
import { Features } from './index';

export default {
  title: 'ui/tamagui/Features',
  component: Features,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <Features items={['item1', 'item2', 'ajith']} size="md" />;
