import React, { useMemo } from 'react';
import type { MDXProps } from '../../mdx/MDX';
import { MDX } from '../../mdx/MDX';

export interface CodeBlockProps extends Omit<MDXProps, 'children'> {
  children?: string;
  language?: string;
}

export function CodeBlock({ children, language = 'tsx', ...props }: CodeBlockProps) {
  const mdxString = useMemo(
    () => `\`\`\`${language}
${children?.trim()}
\`\`\``,
    [children, language],
  );
  return <MDX {...props}>{mdxString}</MDX>;
}
