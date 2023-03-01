import React from 'react';
import { Notice } from './index';

export default {
  title: 'ui/tamagui/Notice',
  component: Notice,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <Notice />;
