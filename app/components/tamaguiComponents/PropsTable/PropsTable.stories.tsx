import React from 'react';
import { PropsTable } from './index';

export default {
  title: 'app/tamagui/PropsTable',
  component: PropsTable,
  parameters: { status: { type: 'beta' } },
};

export const Default = () => (
  <PropsTable
    data={[
      {
        name: 'propOne',
        required: true,
        type: 'string',
        description: 'This is the first prop',
      },
      {
        name: 'propTwo',
        required: false,
        type: 'boolean',
        default: false,
        description: 'This is the second prop',
      },
    ]}
  />
);
