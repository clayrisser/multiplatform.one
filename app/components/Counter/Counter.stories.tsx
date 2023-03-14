import React from 'react';
import { Counter } from './index';

export default {
  title: 'app/components/Counter',
  component: Counter,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <Counter />;
