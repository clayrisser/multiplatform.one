import React from 'react';
import { DocsRouteNavItem } from './index';

export default {
  title: 'app/tamagui/DocsRouteNavItem',
  component: DocsRouteNavItem,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <DocsRouteNavItem href="">Docs Route Nav Item</DocsRouteNavItem>;
