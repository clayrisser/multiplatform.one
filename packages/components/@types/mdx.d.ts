declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { Components } from "@mdx-js/react/lib";
  const main: ComponentType<{ components?: Components }>;
  export = main;
}
