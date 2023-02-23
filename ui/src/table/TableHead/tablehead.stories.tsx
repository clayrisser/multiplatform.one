import React from 'react';
import { TableHead } from './index';

export default {
  title: 'components/TableHead',
  component: TableHead,
};

export const main = () => (
  <TableHead
    label={['a', 'b', 'c', 'd', 'e', 'f']}
    backgroundColor="black"
    textStyle={{ col: 'blue' }}
    jc="space-between"
  />
);
