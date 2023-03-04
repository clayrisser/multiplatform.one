import React from 'react';
import { MDXProvider } from './index';

export default {
  title: 'app/tamagui/MDXProvider',
  component: MDXProvider,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const Main = () => <MDXProvider />;
