import React from 'react';
import { FormSubmitButton } from './index';

export default {
  title: 'forms/FormSubmitButton',
  component: FormSubmitButton,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => <FormSubmitButton />;
