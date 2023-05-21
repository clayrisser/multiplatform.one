import type { CodeProps } from './Code';
import { createContext } from 'react';

export interface CodeBlockContextValue extends CodeProps {
  disableCopy?: boolean;
  isCollapsible?: boolean;
  isHighlightingLines?: boolean;
  showLineNumbers?: boolean;
}

export const CodeBlockContext = createContext<CodeBlockContextValue>({});
