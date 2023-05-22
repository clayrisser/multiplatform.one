import React from 'react';
import { SimpleSheet } from './index';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'panels/SimpleSheet',
  component: SimpleSheet,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <SimpleSheet />;
export default meta;
