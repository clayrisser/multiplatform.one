import React from 'react';
import { DocsMenuContents } from './index';

export default {
  title: 'app/tamagui/DocsMenuContents',
  component: DocsMenuContents,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <DocsMenuContents />;
