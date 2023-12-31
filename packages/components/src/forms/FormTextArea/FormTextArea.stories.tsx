import React from 'react';
import { FormTextArea } from './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'forms/FormTextArea',
  component: FormTextArea,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <FormTextArea
    label="Description"
    name="description"
    defaultValue=""
    rules={{ required: true }}
    onChangeText={action('onChangeText')}
  />
);
