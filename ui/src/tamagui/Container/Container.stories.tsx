import React from 'react';
import { Container } from './index';
import { H1 } from 'tamagui';

export default {
  title: 'ui/tamagui/Container',
  component: Container,
  parameters: {
    Status: {
      type: 'beta',
    },
  },
};

export const main = () => (
  <Container>
    <H1>container</H1>
  </Container>
);
