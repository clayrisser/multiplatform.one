import React from 'react';
import { SimpleForm } from '../SimpleForm';
import { FormSubmitButton } from './index';

export default {
  title: 'forms/FormSubmitButton',
  component: FormSubmitButton,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <SimpleForm>
    <FormSubmitButton>Click here</FormSubmitButton>
  </SimpleForm>
);
