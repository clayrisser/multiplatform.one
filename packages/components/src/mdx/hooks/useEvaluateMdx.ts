/*
 * File: /src/mdx/hooks/useEvaluateMdx.ts
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

import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import * as jsxRuntime from "react/jsx-runtime";

export function useEvaluateMdx(code?: string, options?: Record<string, any>) {
  const [Component, setComponent] =
    useState<ComponentType<{ components?: Record<string, any> }>>();

  useEffect(() => {
    if (!code) return;
    setComponent(() => evaluateMdx(code, options));
  }, [code, options]);

  return Component;
}

function evaluateMdx(code: string, options?: Record<string, any>) {
  return run(code, {
    ...jsxRuntime,
    ...options,
  }).default as ComponentType<{ components?: MDXComponents }>;
}

const AsyncFunction = Object.getPrototypeOf(run).constructor;
function run(code: string, options: Record<string, any>) {
  return new AsyncFunction(String(code))(options);
}
