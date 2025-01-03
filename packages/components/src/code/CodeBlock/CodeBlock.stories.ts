import type { Meta, StoryObj } from "@storybook/react";
import { CodeBlock } from "./index";

const meta: Meta = {
  title: "code/CodeBlock",
  component: CodeBlock,
  parameters: {
    status: { type: "beta" },
  },
};

export const main: StoryObj<typeof CodeBlock> = {
  args: {
    backgroundColor: "$color2",
    debug: false,
    disableCopy: false,
    isCollapsible: false,
    isHighlightingLines: true,
    showLineNumbers: false,
    children: `
const hello = 'world';

function howdy() {
  return 'texas';
}
`,
  },
};

export default meta;
