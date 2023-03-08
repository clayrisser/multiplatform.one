import React from 'react';
import { DocsPage } from './index';

export default {
  title: 'app/tamaguiComponents/DocsPage',
  component: DocsPage,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <DocsPage>Hello world</DocsPage>;
