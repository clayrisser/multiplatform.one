import * as jsxRuntime from 'react/jsx-runtime';
import type { ComponentType } from 'react';
import type { Components } from '@mdx-js/react/lib';
import { useState, useEffect } from 'react';

export function useEvaluateMdx(code?: string, options?: Record<string, any>) {
  const [Component, setComponent] = useState<ComponentType<{ components?: Record<string, any> }>>();

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
  }).default as ComponentType<{ components?: Components }>;
}

const AsyncFunction = Object.getPrototypeOf(run).constructor;
function run(code: string, options: Record<string, any>) {
  return new AsyncFunction(String(code))(options);
}
