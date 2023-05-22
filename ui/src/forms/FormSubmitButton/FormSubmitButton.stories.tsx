/* eslint-disable no-empty-function */
import React from 'react';
import { SimpleForm } from '../SimpleForm';
import { FormSubmitButton } from './index';
import { Text } from 'tamagui';

export default {
  title: 'forms/FormSubmitButton',
  component: FormSubmitButton,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <SimpleForm>
    <FormSubmitButton onSubmit={() => console.log('Form submitted')}>Click here</FormSubmitButton>
  </SimpleForm>
);
