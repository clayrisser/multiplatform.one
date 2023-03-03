import React from 'react';
import { MDXProvider } from './index';
import { YStack } from 'tamagui';

export default {
  title: 'ui/tamagui/MDXProvider',
  component: MDXProvider,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const Main = () => <MDXProvider />;
