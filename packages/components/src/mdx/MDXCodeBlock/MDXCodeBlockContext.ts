import { createContext } from "react";
import type { CodeProps } from "../../code/Code";

export interface MDXCodeBlockContextValue extends CodeProps {
  disableCopy?: boolean;
  isCollapsible?: boolean;
  isHighlightingLines?: boolean;
  showLineNumbers?: boolean;
}

export const MDXCodeBlockContext = createContext<MDXCodeBlockContextValue>({});
