import React from 'react';
import { DataTable } from './index';

export default {
  title: 'ui/tamagui/DataTable',
  component: DataTable,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => (
  <DataTable
    title="DataTable"
    rows={[
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['g', 'h', 'i'],

      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['g', 'h', 'i'],
    ]}
  />
);
