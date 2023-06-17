import { FormProgress } from './index';
import React from 'react';

export default {
  title: 'forms/FormProgress',
  component: FormProgress,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const Main = () => <FormProgress value={80} size={3} width={20} vertical />;
