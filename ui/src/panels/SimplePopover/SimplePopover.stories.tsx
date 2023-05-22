import React from 'react';
import { SimplePopover } from './index';
import { Text } from 'tamagui';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'panels/SimplePopover',
  component: SimplePopover,
  parameters: { status: { type: 'beta' } },
};

// eslint-disable-next-line spellcheck/spell-checker
export const main = () => (
  <SimplePopover element={<div>Content from popover</div>}>
    <Text>Click here to check popover</Text>
  </SimplePopover>
);
export default meta;
