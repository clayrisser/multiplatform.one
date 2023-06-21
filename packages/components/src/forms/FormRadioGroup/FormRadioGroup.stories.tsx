import React from 'react';
import { FormRadioGroup } from './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'forms/FormRadioGroup',
  component: FormRadioGroup,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <FormRadioGroup
    name="radio group"
    label="radio group"
    helperText="select an option"
    required
    radioElements={[
      { label: 'option 1', value: 'option1' },
      { label: 'option 2', value: 'option2' },
      { label: 'option 3', value: 'option3' },
    ]}
    onValueChange={action('onValueChange')}
  />
);
