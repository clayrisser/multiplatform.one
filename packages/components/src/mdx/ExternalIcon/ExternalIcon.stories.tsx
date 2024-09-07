import type { Meta } from "@storybook/react";
import React from "react";
import { ExternalIcon } from "./index";

const meta: Meta = {
  title: "mdx/ExternalIcon",
  component: ExternalIcon,
  parameters: { status: { type: "beta" } },
};

export const main = () => <ExternalIcon />;
export default meta;
