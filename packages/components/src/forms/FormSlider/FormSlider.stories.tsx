import React from 'react';
import { FormSlider } from './index';

export default {
  title: 'forms/FormSlider',
  component: FormSlider,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => <FormSlider name="FormSlider" />;
