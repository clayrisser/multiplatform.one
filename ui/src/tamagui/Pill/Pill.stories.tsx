import React from 'react';
import { Pill } from './index';

export default {
  title: 'ui/tamagui/Pill',
  component: Pill,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => <Pill>This is to test Pill</Pill>;