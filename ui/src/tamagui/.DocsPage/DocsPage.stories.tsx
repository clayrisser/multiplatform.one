import React from 'react';
import { allNotPending } from './index';

export default {
  title: 'ui/tamagui/allNotPending ',
  component: allNotPending,
  parameters: { status: { type: 'beta' } },
};
export const main = () => <allNotPending />;
