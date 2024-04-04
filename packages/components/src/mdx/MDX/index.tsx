/**
 * File: /src/mdx/MDX/index.tsx
 * Project: @multiplatform.one/components
 * File Created: 10-10-2023 06:39:34
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import type { MDXComponents } from '@mdx-js/react/lib';
import type { DebugProp } from '@tamagui/web';
import { mdxComponents } from '../components';
import { useCompileAndEvaluateMdx } from '../hooks';
import { useMDXComponents } from '@mdx-js/react';

export interface MDXProps {
  children: string;
  components?: MDXComponents;
  debug?: DebugProp;
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
