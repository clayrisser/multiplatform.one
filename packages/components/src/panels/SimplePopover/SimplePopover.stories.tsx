import React from 'react';
import { SimplePopover } from './index';
import { Text, YStack, Button } from 'tamagui';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'panels/SimplePopover',
  component: SimplePopover,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <SimplePopover trigger={<Button>Click here to get a Popover</Button>}>
    <YStack>
      <Text>popover content</Text>
    </YStack>
  </SimplePopover>
);
export default meta;
