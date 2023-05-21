import React from 'react';
import type { Components } from '@mdx-js/react/lib';
import { mdxComponents } from '../components';
import { useCompileAndEvaluateMdx } from '../hooks';
import { useMDXComponents } from '@mdx-js/react';

export interface MDXProps {
  children: string;
  components?: Components;
  debug?: boolean;
}

const logger = console;

export function MDX({ children, debug, ...props }: MDXProps) {
  const components = useMDXComponents();
  const { Component, code, frontmatter } = useCompileAndEvaluateMdx(children);
  if (!Component) return <>{}</>;
  if (debug) {
    logger.debug('MDX', { frontmatter });
    logger.debug(code);
  }
  return (
    <Component
      components={{
        ...mdxComponents,
        ...components,
        ...props.components,
      }}
    />
  );
}
