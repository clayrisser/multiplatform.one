import React from 'react';
import { SimpleForm } from '../SimpleForm';
import { FormSubmitButton } from './index';
import { action } from '@storybook/addon-actions';

export default {
  title: 'forms/FormSubmitButton',
  component: FormSubmitButton,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <SimpleForm>
    <FormSubmitButton onPress={action('onClick')}>Click here</FormSubmitButton>
  </SimpleForm>
);
