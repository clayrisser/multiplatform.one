import React from 'react';
import { ColorToggleButton } from './index';

export default {
  title: 'app/tamagui/ColorToggleButton',
  component: ColorToggleButton,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => <ColorToggleButton />;
