import React from 'react';
import { InstallInput } from './index';

export default {
  title: 'app/tamagui/InstallInput',
  component: InstallInput,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <InstallInput />;
