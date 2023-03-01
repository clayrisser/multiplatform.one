import React from 'react';
import DocSearch from './index';

export default {
  title: 'ui/tamagui/DocSearch',
  component: DocSearch,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <DocSearch />;
