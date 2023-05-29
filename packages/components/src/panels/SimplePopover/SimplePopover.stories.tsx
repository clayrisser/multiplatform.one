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
  <SimplePopover
    element={
      <YStack>
        <Text>popover content</Text>
      </YStack>
    }
    arrowStyle={{ bc: '$backgroundStrong' }}
  >
    <Button>Click here to get a Popover</Button>
  </SimplePopover>
);
export default meta;
