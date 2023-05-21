import { useCompileMdx } from './useCompileMdx';
import { useEvaluateMdx } from './useEvaluateMdx';

export function useCompileAndEvaluateMdx(
  source: string,
  compileOptions?: Record<string, any>,
  evaluateOptions?: Record<string, any>,
) {
  const { code, frontmatter } = useCompileMdx(source, compileOptions);
  const Component = useEvaluateMdx(code, evaluateOptions);
  if (!code || !frontmatter || !Component) return {};
  return { Component, code, frontmatter };
}
