import React from 'react';
import type { Meta } from '@storybook/react';
import { MDX } from './index';

const meta: Meta = {
  title: 'mdx/MDX',
  parameters: {
    status: { type: 'beta' },
  },
};

const mdxSource = `
# Hello

\`\`\`tsx
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
const hello = "world";
\`\`\`
`;

export const main = () => <MDX debug>{mdxSource}</MDX>;

export default meta;
