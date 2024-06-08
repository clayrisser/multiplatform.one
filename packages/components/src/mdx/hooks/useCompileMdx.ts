/*
 * File: /src/mdx/hooks/useCompileMdx.ts
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
        // useDynamicImport: true,
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
