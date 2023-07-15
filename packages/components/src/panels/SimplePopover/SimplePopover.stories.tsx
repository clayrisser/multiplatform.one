import React from 'react';
import { SimplePopover } from './index';
import { Text, YStack, Button, XStack } from 'tamagui';
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

function Open() {
  return (
    <SimplePopover
      trigger={<Button>hove on it to get Popover</Button>}
      triggerOnHover
      arrow={false}
      triggerStyle={{ als: 'center', ai: 'center' }}
    >
      <YStack>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <Text key={i}>{i}</Text>
        ))}
      </YStack>
    </SimplePopover>
  );
}

export const open = () => (
  <XStack jc="space-around">
    <Open />
    <Open />
  </XStack>
);

export default meta;
