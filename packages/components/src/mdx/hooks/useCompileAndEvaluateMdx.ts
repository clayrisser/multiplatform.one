/*
 * File: /src/mdx/hooks/useCompileAndEvaluateMdx.ts
 * Project: @multiplatform.one/components
 * File Created: 04-04-2024 15:50:39
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

import type { ComponentType } from "react";
import { useCompileMdx } from "./useCompileMdx";
import { useEvaluateMdx } from "./useEvaluateMdx";

export function useCompileAndEvaluateMdx(
  source: string,
  compileOptions?: Record<string, any>,
  evaluateOptions?: Record<string, any>,
): {
  Component?:
    | ComponentType<{
        components?: Record<string, any> | undefined;
      }>
    | undefined;
  code?: string;
  frontmatter?: Record<string, any>;
} {
  const { code, frontmatter } = useCompileMdx(source, compileOptions);
  const Component = useEvaluateMdx(code, evaluateOptions);
  if (!code || !frontmatter || !Component) return {};
  return { Component, code, frontmatter };
}
