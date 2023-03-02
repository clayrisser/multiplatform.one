import React from 'react';

import type { Frontmatter } from './frontMatter';

export const FrontmatterContext = React.createContext<Frontmatter>({} as any);
