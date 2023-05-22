import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MDXCodeBlock } from './index';
import { XStack, Text } from 'tamagui';

const meta: Meta = {
  title: 'mdx/MDXCodeBlock',
  component: MDXCodeBlock,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main: StoryObj<typeof MDXCodeBlock> = {
  args: {
    isCollapsible: false,
    bg: '$color3',
  },
  render: (args) => (
    <MDXCodeBlock {...args}>
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
    </MDXCodeBlock>
  ),
};

export default meta;
