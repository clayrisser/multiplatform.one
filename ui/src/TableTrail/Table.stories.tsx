import React from 'react';
import { Table } from './index';

export default {
  title: 'ui/TableTrail',
  component: Table,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <Table
    headerData={[['HeaderA', 'HeaderB', 'HeaderC', 'HeaderD']]}
    headerDataStyle={{ textAlign: 'center', als: 'center' }}
    headerStyle={{ jc: 'space-evenly', bc: '$background', m: 10, padding: 10, br: 10 }}
    rowData={[
      ['hello', 'ajith', 'hello', 'ajith'],
      ['hello', 'name', 'ajith', 'hello'],
      ['may', 'I', 'hate', 'you'],
      ['ajith', 'hello', 'ajith', 'hello'],
    ]}
    rowDataStyle={{ ta: 'center', jc: 'flex-start', als: 'center' }}
    rowStyle={{ jc: 'space-evenly', bc: '$background', m: 10, padding: 10, br: 10 }}
  />
);
