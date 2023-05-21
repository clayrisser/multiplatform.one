import React from 'react';
import { DocCodeBlock } from './index';
import type { Meta, StoryObj } from '@storybook/react';
import { XStack, Text } from 'tamagui';

const meta: Meta = {
  title: 'code/DocCodeBlock',
  component: DocCodeBlock,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main: StoryObj<typeof DocCodeBlock> = {
  args: {
    isCollapsible: false,
    bg: '$color3',
  },
  render: (args) => (
    <DocCodeBlock {...args}>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
    </DocCodeBlock>
  ),
};

export default meta;
