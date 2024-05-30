/**
 * File: /src/theme/theme.native.tsx
 * Project: multiplatform.one
 * File Created: 26-04-2024 08:06:50
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import type { Actions } from '@multiplatform.one/zustand';
import type { ThemeState, ThemeProviderProps } from './theme';
import { createStateStore } from '@multiplatform.one/zustand';

const defaultThemeState: ThemeState = { root: 'system', sub: 'gray' };

const ThemeContext = createContext<ThemeState>(defaultThemeState);

const { useStore: useThemeState } = createStateStore<ThemeState, Actions<ThemeState>>(
  'theme',
  {
    root: null,
    sub: null,
  },
  undefined,
  {
    persist: true,
  },
);

export function useTheme(): [ThemeState, (theme: Partial<ThemeState>) => undefined] {
  const themeContextValue = useContext(ThemeContext);
  const themeState = useThemeState();
  return [
    {
      root: themeContextValue.root || 'system',
      sub: themeContextValue.sub,
    },
    (theme: Partial<ThemeState>) => {
      if (typeof theme.root !== 'undefined') {
        if (theme.root === null || theme.root === 'system') {
          themeState.setRoot(null);
        } else {
          themeState.setRoot(theme.root);
        }
      }
      if (typeof theme.sub !== 'undefined') {
        if (theme.sub === null) {
          themeState.setSub(null);
        } else {
          themeState.setSub(theme.sub);
        }
      }
    },
  ];
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const defaultThemeValue = useMemo(
    () => ({
      ...defaultThemeState,
      ...theme,
    }),
    [theme?.root, theme?.sub],
  );
  // const [, setRootTheme] = useRootTheme();
  const [, setTheme] = useTheme();
  const themeState = useThemeState();
  const root = themeState.root || defaultThemeValue.root;
  const sub = themeState.sub || defaultThemeValue.sub;
  const value = React.useMemo(() => ({ root, sub }), [root, sub]);

  useEffect(() => {
    setTheme({ root, sub });
  }, [defaultThemeValue.root, defaultThemeValue.sub]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
