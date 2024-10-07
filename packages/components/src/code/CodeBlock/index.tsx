import { useMemo } from "react";
import type { MDXProps } from "../../mdx/MDX";
import { MDX } from "../../mdx/MDX";
import type { MDXCodeBlockContextValue } from "../../mdx/MDXCodeBlock/MDXCodeBlockContext";
import { MDXCodeBlockContext } from "../../mdx/MDXCodeBlock/MDXCodeBlockContext";

export interface CodeBlockProps
  extends Omit<MDXProps, "children">,
    MDXCodeBlockContextValue {
  children?: string;
  language?: string;
}

export function CodeBlock({
  children,
  language = "tsx",
  components,
  debug,
  ...props
}: CodeBlockProps) {
  const mdxString = useMemo(
    () => `\`\`\`${language}
${children?.trim()}
\`\`\``,
    [children, language],
  );
  const value = useMemo(() => ({ ...props, debug }), [props, debug]);
  return (
    <MDXCodeBlockContext.Provider value={value}>
      <MDX components={components} debug={debug}>
        {mdxString}
      </MDX>
    </MDXCodeBlockContext.Provider>
  );
}
