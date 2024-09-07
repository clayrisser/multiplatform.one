import type { Meta } from "@storybook/react";
import React from "react";
import { MDX } from "./index";

const meta: Meta = {
  title: "mdx/MDX",
  parameters: {
    status: { type: "beta" },
  },
};

const mdxSource = `
# Hello

> I am a blockquote

# H1
## H2
#### H4

[example.com](https://example.com)

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
