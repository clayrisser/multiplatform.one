import React from 'react';
import { FormSlider } from './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'forms/FormSlider',
  component: FormSlider,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => <FormSlider name="FormSlider" onValueChange={action(`onValueChange`)} />;
