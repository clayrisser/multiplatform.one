import React from 'react';
import { Row } from './Row';
import { Table } from './index';
import { Column } from './Column';

export default {
  title: 'ui/Table',
  component: Row,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <Table yStackProps={{ width: 500, bc: '$background', bw: 1, borderRadius: 10 }}>
    <Row
      textProps={{ textAlign: 'center' }}
      xStackProps={{ jc: 'space-between', padding: 20 }}
      data={[
        ['a', 'b', 'c', 'd'],
        [1, 2, 3, 4, 5],
      ]}
    />
    <Column
      stackProps={{ jc: 'space-evenly', bc: '$background', padding: 20 }}
      data={[
        ['hello', 'ajith'],
        ['hello', 'name'],
      ]}
      textProps={{ ta: 'center', jc: 'space-evenly' }}
    />
  </Table>
);
