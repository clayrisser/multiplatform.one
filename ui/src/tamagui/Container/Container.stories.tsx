import React from 'react';
import { Container } from './index';

export default {
  title: 'ui/tamagui/Container',
  component: Container,
  parameters: { status: { type: 'beta' } },
};
export const main = () => <Container bc="$background">Container component from tamagui</Container>;
