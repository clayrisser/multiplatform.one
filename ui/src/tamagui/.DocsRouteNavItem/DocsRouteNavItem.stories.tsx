import React from 'react';
import { DocsRouteNavItem } from './index';

export default {
  title: 'ui/tamagui/DocsRouteNavItem',
  component: DocsRouteNavItem,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <DocsRouteNavItem />;
