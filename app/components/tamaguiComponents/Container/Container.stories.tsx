import React from 'react';
import { Container } from './index';
import { H1 } from 'tamagui';

export default {
  title: 'app/tamagui/Container',
  component: Container,
  parameters: {
    Status: {
      type: 'beta',
    },
  },
};

export const main = () => <Container>container</Container>;