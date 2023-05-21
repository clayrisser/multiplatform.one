import { Code } from './index';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'code/Code',
  component: Code,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main: StoryObj<typeof Code> = {
  args: {
    children: 'const hello = "world"',
  },
};

export default meta;
