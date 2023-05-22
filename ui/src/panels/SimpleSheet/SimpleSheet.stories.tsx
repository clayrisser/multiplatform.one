import React from 'react';
// import { Text } from 'tamagui';
import { SimpleSheet } from './index';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  // export default {
  title: 'panels/SimpleSheet',
  component: SimpleSheet,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <SimpleSheet modal />;
export default meta;
