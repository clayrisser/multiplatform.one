import React from 'react';
import { Features } from './index';

export default {
  title: 'app/tamaguiComponents/Features',
  component: Features,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <Features items={['item1', 'item2', 'item3']} size="md" />;
