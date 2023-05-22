import React from 'react';
import { SimplePopover } from './index';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'panels/SimplePopover',
  component: SimplePopover,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <SimplePopover element={undefined} />;
export default meta;
