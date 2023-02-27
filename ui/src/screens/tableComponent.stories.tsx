import React from 'react';
import { Table, Header, Row, Rows } from '../tableComponent';

export default {
  title: 'Screens/TableComponent',
};

export const main = (args: any) => {
  return (
    <Table {...args.table}>
      <Header {...args.columns} />
      <Rows {...args.rows} />
      {/* <Row {...args.row} xStack={{}} text={{}} row={[5, 'Bob', 23, 'rob']} /> */}
    </Table>
  );
};

main.args = {
  table: {
    yStack: {},
  },
  columns: {
    xStack: {},
    text: { padding: 10 },
    columns: ['S.no', 'Name', 'Age', 'Location'],
  },
  rows: {
    yStack: {},
    xStack: {},
    text: {},
    rows: [
      [1, 'Ben', 28, 'Texas'],
      [2, 'Tom', 30, 'Texas'],
      [3, 'Dharmendra Boddeda', 25, 'Texas'],
      [4, 'Ajith', 27, 'Vizag'],
      [5, 'Rani', 23, 'Vizag'],
    ],
  },
  row: {
    xStack: {},
    text: {},
    row: [],
  },
};
