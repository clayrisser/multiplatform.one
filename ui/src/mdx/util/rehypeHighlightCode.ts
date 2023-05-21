// https://github.com/tamagui/tamagui/blob/086f4d0a3ffb1767547e1ab9f51502c59a098504/apps/site/lib/rehype-highlight-code.ts

import rangeParser from 'parse-numeric-range';
import tsx from 'refractor/lang/tsx';
import { refractor } from 'refractor';
import { rehypeHighlightLine } from './rehypeHighlightLine';
import { rehypeHighlightWord } from './rehypeHighlightWord';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';

refractor.register(tsx);

export function rehypeHighlightCode(_options = {}) {
  function visitor(node: any, index: any, parent: any) {
    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code' || !node.properties.className) {
      return;
    }
    const [, lang] = node.properties.className[0].split('-');
    const codeString = toString(node);
    let result = refractor.highlight(codeString, lang);
    const linesToHighlight = rangeParser(node.properties.line || '0');
    result = rehypeHighlightLine(result, linesToHighlight);
    node.children = rehypeHighlightWord(result);
  }
  return (tree: any) => {
    visit(tree, 'element', visitor);
  };
}
