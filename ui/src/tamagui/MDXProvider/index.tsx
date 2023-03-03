import React from 'react';
import { YStack } from 'tamagui';

import { FrontMatterContext } from 'ui/src/tamagui/FrontMatterContext';

// Custom provider for next-mdx-remote
// https://github.com/hashicorp/next-mdx-remote#using-providers

export function MDXProvider(props) {
  const { frontMatter, children } = props;
  return (
    <YStack>
      <FrontMatterContext.Provider value={frontMatter}>{children}</FrontMatterContext.Provider>
    </YStack>
  );
}
