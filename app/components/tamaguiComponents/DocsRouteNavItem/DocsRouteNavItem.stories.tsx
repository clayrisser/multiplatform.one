import React from 'react';
import { DocsRouteNavItem } from './index';

export default {
  title: 'app/tamaguiComponents/DocsRouteNavItem',
  component: DocsRouteNavItem,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <DocsRouteNavItem href="">Docs Route Nav Item</DocsRouteNavItem>;
