import React from 'react';
import { Table } from './index';
import { Row } from './Row';
import { YStack, Text } from 'tamagui';

export default {
  title: '',
  component: Table,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  //   <Table>
  //     <Row data={['a', 'b', 'c', 'd']} />
  //   </Table>
  <YStack>
    <Text>Hello</Text>
  </YStack>
);
