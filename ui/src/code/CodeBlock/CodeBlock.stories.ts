import { CodeBlock } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'code/CodeBlock',
  component: CodeBlock,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main: StoryObj<typeof CodeBlock> = {
  args: {
    children: `
const hello = 'world';

function howdy() {
  return 'texas';
}
`,
  },
};

export default meta;
