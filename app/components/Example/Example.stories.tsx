import React from 'react';
import { MultiValueComponent } from './index';

export default {
  title: 'app/components/Example',
  component: MultiValueComponent,
  parameters: {
    Status: {
      type: 'beta',
    },
  },
};
export const main = () => <MultiValueComponent />;
