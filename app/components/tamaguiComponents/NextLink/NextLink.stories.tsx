import React from 'react';
import { NextLink } from './index';
import { Text } from 'tamagui';

export default {
  title: 'ui/tamagui/NextLink',
  component: NextLink,
  parameters: { status: { type: 'beta' } },
};
export const main = () => (
  <NextLink href="https://www.google.com/">
    <Text>Click Here</Text>
  </NextLink>
);
