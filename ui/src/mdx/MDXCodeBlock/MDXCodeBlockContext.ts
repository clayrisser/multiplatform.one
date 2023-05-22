import type { CodeProps } from '../../code/Code';
import { createContext } from 'react';

export interface MDXCodeBlockContextValue extends CodeProps {
  disableCopy?: boolean;
  isCollapsible?: boolean;
  isHighlightingLines?: boolean;
  showLineNumbers?: boolean;
}

export const MDXCodeBlockContext = createContext<MDXCodeBlockContextValue>({});
