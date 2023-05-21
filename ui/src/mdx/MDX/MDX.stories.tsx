import React from 'react';
import type { Meta } from '@storybook/react';
import { MDX } from '.';

const meta: Meta = {
  title: 'mdx/MDX',
  parameters: {
    status: { type: 'beta' },
  },
};

const mdxSource = `
---
title: Example Post
published: 2021-02-13
description: This is some description
---

# Hello

Here's a **neat** demo:

\`\`\`
const hello="world";
\`\`\`
`;

export const main = () => <MDX>{mdxSource}</MDX>;

export default meta;
