import React from 'react';
import { NavHeading } from './index';
import { H4, H3, YStack, H6, H1, H2 } from 'tamagui';

export default {
  title: 'app/tamaguiComponents/NavHeading',
  component: NavHeading,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const main = () => (
  <YStack>
    <NavHeading>
      <YStack>
        <H4>NavHeading</H4>
        <H3>Navigate</H3>
        <H2>Write Something</H2>
        <H6>Write Something</H6>
        <H1>Ready 123</H1>
      </YStack>
    </NavHeading>
    <H4>NavHeading</H4>
    <H4>Write Something</H4>
  </YStack>
);
