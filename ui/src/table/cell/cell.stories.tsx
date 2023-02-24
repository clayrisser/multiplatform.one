import { Cell } from './index';
import { Text } from 'tamagui';
import React from 'react';

export default {
  title: 'components/Cell',
  component: Cell,
};

export const main = () => (
  <Cell w={50} height={30} borderWidth={1}>
    <Text>Cell</Text>
  </Cell>
);
