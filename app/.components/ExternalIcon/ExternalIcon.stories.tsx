import React from 'react';
import { ExternalIcon } from './index';

export default {
  title: 'app/tamagui/ExternalIcon',
  component: ExternalIcon,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <ExternalIcon />;
