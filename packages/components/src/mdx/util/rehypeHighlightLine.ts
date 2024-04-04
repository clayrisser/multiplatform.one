/*
 *  File: /src/mdx/util/rehypeHighlightLine.ts
 *  Project: @multiplatform.one/components
 *  File Created: 10-10-2023 06:39:34
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2024
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

// https://github.com/tamagui/tamagui/blob/086f4d0a3ffb1767547e1ab9f51502c59a098504/apps/site/lib/rehype-highlight-line.ts

import parse from 'rehype-parse';
import { toHtml } from 'hast-util-to-html';
import { unified } from 'unified';

export function rehypeHighlightLine(ast: any, lines: any[]) {
  const formattedAst = applyMultilineFix(ast);
  const numbered = lineNumberify(formattedAst).nodes;
  return wrapLines(numbered, lines);
}

function lineNumberify(ast: any, lineNum = 1) {
  let lineNumber = lineNum;
  return ast.reduce(
    (result: any, node: any) => {
      if (node.type === 'text') {
        if (node.value.indexOf('\n') === -1) {
          node.lineNumber = lineNumber;
          result.nodes.push(node);
          return result;
        }
        const lines = node.value.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (i !== 0) ++lineNumber;
          if (i === lines.length - 1 && lines[i].length === 0) continue;
          result.nodes.push({
            type: 'text',
            value: i === lines.length - 1 ? lines[i] : `${lines[i]}\n`,
            lineNumber: lineNumber,
          });
        }
        result.lineNumber = lineNumber;
        return result;
      }
      if (node.children) {
        node.lineNumber = lineNumber;
        const processed = lineNumberify(node.children, lineNumber);
        node.children = processed.nodes;
        result.lineNumber = processed.lineNumber;
        result.nodes.push(node);
        return result;
      }
      result.nodes.push(node);
      return result;
    },
    { nodes: [], lineNumber: lineNumber },
  );
}

function wrapLines(ast: any[], linesToHighlight: any) {
  const highlightAll = linesToHighlight.length === 1 && linesToHighlight[0] === 0;
  const allLines: any[] = Array.from(new Set(ast.map((x) => x.lineNumber)));
  let i = 0;
  const wrapped = allLines.reduce((nodes, marker) => {
    const line = marker;
    const children: any[] = [];
    for (; i < ast.length; i++) {
      if (ast[i].lineNumber < line) {
        nodes.push(ast[i]);
        continue;
      }
      if (ast[i].lineNumber === line) {
        children.push(ast[i]);
        continue;
      }
      if (ast[i].lineNumber > line) {
        break;
      }
    }
    nodes.push({
      type: 'element',
      tagName: 'div',
      properties: {
        dataLine: line,
        className: 'highlight-line',
        dataHighlighted: linesToHighlight.includes(line) || highlightAll ? 'true' : 'false',
      },
      children,
      lineNumber: line,
    });
    return nodes;
  }, []);
  return wrapped;
}

// https://github.com/gatsbyjs/gatsby/pull/26161/files
const MULTILINE_TOKEN_SPAN = /<span class="token ([^"]+)">[^<]*\n[^<]*<\/span>/g;

function applyMultilineFix(ast: any) {
  // AST to HTML
  let html = toHtml(ast);
  // Fix JSX issue
  html = html.replace(MULTILINE_TOKEN_SPAN, (match, token) =>
    match.replace(/\n/g, `</span>\n<span class="token ${token}">`),
  );
  // HTML to AST
  const hast = unified()
    .use(parse as any, { emitParseErrors: true, fragment: true })
    .parse(html);
  return (hast as any).children;
}
