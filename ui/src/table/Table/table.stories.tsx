import React from 'react';
import { Table } from './index';

export default {
  title: 'components/Table',
  component: Table,
};

export const main = () => (
  <Table
    label={['a', 'b', 'c']}
    row={[
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['g', 'h', 'i'],
      ['j', 'k', 'l'],
      ['m', 'n', 'o'],
      ['p', 'q', 'r'],
      ['s', 't', 'u'],
      ['v', 'w', 'x'],
      ['y', 'z', '0'],
    ]}
    rowStyle={{ jc: 'space-evenly', backgroundColor: '$backgroundTransparent' }}
    headTextStyle={{ col: 'blue' }}
    rowDataStyle={{ jc: 'space-evenly' }}
    headRowStyle={{ backgroundColor: 'black' }}
  />
);
