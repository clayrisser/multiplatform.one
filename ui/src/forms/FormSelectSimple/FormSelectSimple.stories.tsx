import React from 'react';
import { FormSelectSimple } from './index';

export default {
  title: 'forms/FormSelectSimple',
  component: FormSelectSimple,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <FormSelectSimple
    label="Example Select"
    name="exampleSelect"
    defaultValue={false}
    helperText="This is an example select"
  />
);
