import React from 'react';

import type { Frontmatter } from './frontMatter';

export const FrontMatterContext = React.createContext<Frontmatter>({} as any);
