// https://github.com/wooorm/xdm#syntax-highlighting-with-the-meta-field

import { visit } from "unist-util-visit";
const re = /\b([-\w]+)(?:=(?:"([^"]*)"|'([^']*)'|([^"'\s]+)))?/g;

export function rehypeMetaAttributes(_options = {}) {
  function onElement(node: any) {
    let match: any;
    if (node.tagName === "code" && node.data && node.data.meta) {
      re.lastIndex = 0; // Reset regex.
      match = re.exec(node.data.meta);
      while (match) {
        node.properties[match[1]] = match[2] || match[3] || match[4] || "";
        match = re.exec(node.data.meta);
      }
    }
  }
  return (tree: any) => {
    visit(tree, "element", onElement);
  };
}
