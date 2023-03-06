import React from 'react';
import { AnimationsDemo } from './index';

export default {
  title: 'app/tamagui/AnimationsDemo',
  component: AnimationsDemo,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <AnimationsDemo />;
