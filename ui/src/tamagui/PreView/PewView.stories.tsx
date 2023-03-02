import React from 'react';
import { Preview } from './index';

export default {
  title: 'ui/tamagui/PreView',
  component: Preview,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <Preview>This is to test PreView</Preview>;
