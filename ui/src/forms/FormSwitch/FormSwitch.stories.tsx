import React from 'react';
import { FormSwitch } from './index';

export default {
  title: 'forms/FormSwitch',
  component: FormSwitch,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <FormSwitch label="Example Switch" name="exampleSwitch" helperText="This is an example switch" defaultValue={false} />
);
