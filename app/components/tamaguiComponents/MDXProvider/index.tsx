import React from 'react';
import { YStack } from 'tamagui';

import { FrontmatterContext } from '../FrontMatterContext';

// Custom provider for next-mdx-remote
// https://github.com/hashicorp/next-mdx-remote#using-providers

export function MDXProvider(props) {
  const { frontMatter, children } = props;
  return (
    <YStack>
      <FrontmatterContext.Provider value={frontMatter}>{children}</FrontmatterContext.Provider>
    </YStack>
  );
}
