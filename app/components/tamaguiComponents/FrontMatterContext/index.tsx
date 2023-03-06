import React from 'react';

import type { FrontMatter } from './frontMatter';

export const FrontmatterContext = React.createContext<FrontMatter>({} as any);
