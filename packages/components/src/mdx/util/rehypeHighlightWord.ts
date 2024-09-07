/*
 * File: /src/mdx/util/rehypeHighlightWord.ts
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

// https://github.com/tamagui/tamagui/blob/086f4d0a3ffb1767547e1ab9f51502c59a098504/apps/site/lib/rehype-highlight-word.ts

import { toHtml } from "hast-util-to-html";
import type { Content, Node } from "hast-util-to-html/lib";
import parse from "rehype-parse";
import { unified } from "unified";

const CALLOUT = /__(.*?)__/g;

export function rehypeHighlightWord(code: Node | Content[]) {
  const html = toHtml(code);
  const result = html.replace(
    CALLOUT,
    (_, text) => `<span class="highlight-word">${text}</span>`,
  );
  const hast = unified()
    .use(parse as any, { emitParseErrors: true, fragment: true })
    .parse(result);
  return (hast as any).children;
}
