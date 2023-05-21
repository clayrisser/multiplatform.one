import React, { useMemo } from 'react';
import type { CodeBlockContextValue } from '../CodeBlockContext';
import type { MDXProps } from '../../mdx/MDX';
import { CodeBlockContext } from '../CodeBlockContext';
import { MDX } from '../../mdx/MDX';

export interface CodeBlockProps extends Omit<MDXProps, 'children'>, CodeBlockContextValue {
  children?: string;
  language?: string;
}

export function CodeBlock({ children, language = 'tsx', components, debug, ...props }: CodeBlockProps) {
  const mdxString = useMemo(
    () => `\`\`\`${language}
${children?.trim()}
\`\`\``,
    [children, language],
  );
  const value = useMemo(() => ({ ...props, debug }), [props, debug]);
  return (
    <CodeBlockContext.Provider value={value}>
      <MDX components={components} debug={debug}>
        {mdxString}
      </MDX>
    </CodeBlockContext.Provider>
  );
}
