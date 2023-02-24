import React from 'react';
import { Table, Header, Row, Rows } from '../tableComponent';

export default {
  title: 'Screens/Table',
};

export const main = () => {
  return (
    <Table yStack={{}}>
      <Header xStack={{}} text={{ padding: 10 }} columns={['S.no', 'Name', 'Age', 'Location']} />
      <Rows
        yStack={{}}
        xStack={{}}
        text={{}}
        rows={[
          [1, 'Ben', 28, 'Texas'],
          [2, 'Tom', 30, 'Texas'],
          [3, 'Dharmendra Boddeda', 25, 'Texas'],
          [4, 'Ajith', 27, 'Vizag'],
          [5, 'Rani', 23, 'Vizag'],
        ]}
      />
      {/* <Row xStack={{}} text={{}} row={[5, 'Rani', 23, 'Vizag']} /> */}
    </Table>
  );
};
