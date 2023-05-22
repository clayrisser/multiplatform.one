import React from 'react';
import { FormCheckBox } from './index';

export default {
  title: 'forms/FormCheckBox',
  component: FormCheckBox,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <FormCheckBox name="checkbox" label="checkbox" checkBoxElement={{ label: 'checkbox', value: 'checkbox' }}>
    Hello this is from FormCheckBox
  </FormCheckBox>
);
