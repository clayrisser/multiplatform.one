import React from 'react';
import { SimpleSideSheet } from './index';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'panels/SimpleSideSheet',
  component: SimpleSideSheet,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <SimpleSideSheet />;
export default meta;
