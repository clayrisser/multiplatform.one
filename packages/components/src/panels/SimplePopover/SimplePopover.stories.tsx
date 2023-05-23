import React from 'react';
import { SimplePopover } from './index';
import { Text, YStack } from 'tamagui';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'panels/SimplePopover',
  component: SimplePopover,
  parameters: { status: { type: 'beta' } },
};

// eslint-disable-next-line spellcheck/spell-checker
export const main = () => (
  <SimplePopover
    element={
      <YStack>
        <Text>Content from popover</Text>
      </YStack>
    }
  >
    <Text>Click here to check popover</Text>
  </SimplePopover>
);
export default meta;
