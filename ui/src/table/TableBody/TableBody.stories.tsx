import React from 'react';
import { TableBody } from './index';

export default {
  title: 'components/TableBody',
  component: TableBody,
};

export const main = () => (
  <TableBody
    row={[
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['g', 'h', 'i'],
    ]}
    rowStyle={{ jc: 'space-evenly' }}
  />
);
