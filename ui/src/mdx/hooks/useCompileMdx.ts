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
      const [
        { compile },
        { default: grayMatter },
        { default: rehypeAutolinkHeadings },
        { default: rehypeSlug },
        { default: remarkFrontmatter },
        { default: remarkMdxFrontmatter },
        { rehypeHighlightCode },
        { rehypeMetaAttributes },
      ] = await Promise.all([
        import('@mdx-js/mdx'),
        import('gray-matter'),
        import('rehype-autolink-headings'),
        import('rehype-slug'),
        import('remark-frontmatter'),
        import('remark-mdx-frontmatter'),
        import('../util/rehypeHighlightCode'),
        import('../util/rehypeMetaAttributes'),
      ]);
      const { value } = await compile(source, {
        ...options,
        development: false,
        outputFormat: 'function-body',
        useDynamicImport: true,
        remarkPlugins: [
          ...(options?.remarkPlugins || []),
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
          remarkFrontmatter,
        ],
        rehypePlugins: [
          ...(options?.rehypePlugins || []),
          rehypeAutolinkHeadings,
          rehypeHighlightCode,
          rehypeMetaAttributes,
          rehypeSlug,
        ],
      });
      setCode(value.toString());
      setFrontmatter(grayMatter(source));
    })();
  }, [source, options]);

  if (!code || !frontmatter) return {};
  return { code, frontmatter };
}
