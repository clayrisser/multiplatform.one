import React from 'react';
import { TableScreen } from './index';

export default {
  title: 'components/tables',
  component: TableScreen,
};

export const main = () => (
  <TableScreen
    row={[
      ['2', 'dog', 'elephant', 'frog'],
      ['3', 'goat', 'hat', 'ink'],
    ]}
    flexArr={[1, 1, 1]}
    rowStyle={{
      jc: 'space-evenly',
      width: '100',
    }}
  />
);
