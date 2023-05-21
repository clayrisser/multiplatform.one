// https://github.com/tamagui/tamagui/blob/086f4d0a3ffb1767547e1ab9f51502c59a098504/apps/site/lib/rehype-highlight-word.ts

import parse from 'rehype-parse';
import type { Node, Content } from 'hast-util-to-html/lib';
import { toHtml } from 'hast-util-to-html';
import { unified } from 'unified';

const CALLOUT = /__(.*?)__/g;

export function rehypeHighlightWord(code: Node | Content[]) {
  const html = toHtml(code);
  const result = html.replace(CALLOUT, (_, text) => `<span class="highlight-word">${text}</span>`);
  const hast = unified().use(parse, { emitParseErrors: true, fragment: true }).parse(result);
  return hast.children;
}
