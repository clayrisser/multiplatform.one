import React from 'react';
import { ActiveCircle } from './index';

export default {
  title: 'app/tamaguiComponents/ActiveCircle',
  component: ActiveCircle,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <ActiveCircle isActive={true}>Hello world</ActiveCircle>;
