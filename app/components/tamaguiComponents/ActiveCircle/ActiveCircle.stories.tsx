import React from 'react';
import { ActiveCircle } from './index';

export default {
  title: 'app/tamagui/ActiveCircle',
  component: ActiveCircle,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <ActiveCircle isActive={true}>Hello world</ActiveCircle>;
