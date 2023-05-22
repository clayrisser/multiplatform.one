import React from 'react';
import { SimplePopover } from './index';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'panels/SimplePopover',
  component: SimplePopover,
  parameters: { status: { type: 'beta' } },
};

// eslint-disable-next-line spellcheck/spell-checker
export const main = () => <SimplePopover element={<div>Hello</div>}>Hello world</SimplePopover>;
export default meta;
