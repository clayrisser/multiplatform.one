import React from 'react';

import type { FrontMatter } from './frontMatter';

export const FrontMatterContext = React.createContext<FrontMatter>({} as any);
