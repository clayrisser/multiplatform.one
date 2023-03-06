import React from 'react';
import { DataTable } from './index';

export default {
  title: 'app/tamaguiComponents/DataTable',
  component: DataTable,
  parameters: {
    status: {
      type: 'keep',
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
