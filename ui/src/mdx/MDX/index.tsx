import React from 'react';
import type { Components } from '../components';
import { components } from '../components';
import { useCompileAndEvaluateMdx } from '../hooks';

export interface MDXProps {
  children: string;
  components?: Components;
}

export function MDX({ children, ...props }: MDXProps) {
  const { Component } = useCompileAndEvaluateMdx(children);
  if (!Component) return <>{}</>;
  return (
    <Component
      components={{
        ...components,
        ...props.components,
      }}
    />
  );
}
