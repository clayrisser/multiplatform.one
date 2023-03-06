import React from 'react';
import { MDXProvider } from './index';

export default {
  title: 'app/tamaguiComponents/MDXProvider',
  component: MDXProvider,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const Main = () => <MDXProvider />;
