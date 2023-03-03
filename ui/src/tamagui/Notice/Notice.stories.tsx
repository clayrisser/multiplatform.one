import React from 'react';
import { Notice } from './index';
import { Text } from 'tamagui';

export default {
  title: 'ui/tamagui/Notice',
  component: Notice,
  parameters: {
    status: {
      type: 'keep',
    },
  },
};

export const main = () => (
  <Notice>
    <Text>Hello</Text>
  </Notice>
);
