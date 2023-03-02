import React from 'react';
import { BlogSlugPage } from './index';

export default {
  title: 'ui/tamagui/BlogSlugPage',
  component: BlogSlugPage,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <BlogSlugPage frontmatter={undefined} code={undefined} />;
