import { useState, useEffect } from 'react';

export function useCompileMdx(
  source: string,
  options?: Record<string, any>,
): {
  code?: string;
  frontmatter?: Record<string, any>;
} {
  const [code, setCode] = useState<string | undefined>();
  const [frontmatter, setFrontmatter] = useState<Record<string, any> | undefined>();

  useEffect(() => {
    (async () => {
      const { compile } = await import('@mdx-js/mdx');
      const { default: grayMatter } = await import('gray-matter');
      const { value } = await compile(source, {
        ...options,
        development: false,
        outputFormat: 'function-body',
        useDynamicImport: true,
      });
      setCode(value.toString());
      setFrontmatter(grayMatter(source));
    })();
  }, [source, options]);

  if (!code || !frontmatter) return {};
  return { code, frontmatter };
}
