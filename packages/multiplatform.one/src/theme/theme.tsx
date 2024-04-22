/*
 *  File: /src/cookies.ts
 *  Project: multiplatform.one
 *  File Created: 20-04-2024 20:23:04
 *  Author: Clay Risser
 *  -----
 *  BitSpur (c) Copyright 2021 - 2024
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import type { Actions } from '../zustand';
import type { ColorScheme as TamaguiColorScheme } from '@tamagui/next-theme';
import type { PropsWithChildren } from 'react';
import type { ThemeName } from '@tamagui/web';
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme';
import { MultiPlatform } from 'multiplatform.one';
import { createStateStore } from '../zustand';
import { useCookies } from 'react-cookie';

export const COOKIE_ROOT_THEME = 'multiplatform-one.root-theme';
export const COOKIE_SUB_THEME = 'multiplatform-one.sub-theme';

export type ColorScheme = 'dark' | 'light' | 'system';

export interface ThemeState {
  root: ColorScheme | null;
  sub: ThemeName | null;
}

const defaultThemeState: ThemeState = { root: 'system', sub: 'gray' };

const ThemeContext = createContext<ThemeState>(defaultThemeState);

export interface ThemeProviderProps extends PropsWithChildren {
  cookies?: Record<string, string>;
  theme?: Partial<ThemeState>;
}

const { useStore: useThemeState } = createStateStore<ThemeState, Actions<ThemeState, {}>>(
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
  const [, setCookie, removeCookie] = useCookies([COOKIE_ROOT_THEME, COOKIE_SUB_THEME]);
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
          removeCookie(COOKIE_ROOT_THEME);
          themeState.setRoot(null);
        } else {
          setCookie(COOKIE_ROOT_THEME, theme.root);
          themeState.setRoot(theme.root);
        }
      }
      if (typeof theme.sub !== 'undefined') {
        if (theme.sub === null) {
          removeCookie(COOKIE_SUB_THEME);
          themeState.setSub(null);
        } else {
          setCookie(COOKIE_SUB_THEME, theme.sub);
          themeState.setSub(theme.sub);
        }
      }
    },
  ];
}

export function ThemeProvider({ children, cookies: nextCookies, theme }: ThemeProviderProps) {
  const [localCookies] = useCookies([COOKIE_ROOT_THEME, COOKIE_SUB_THEME]);
  const defaultThemeValue = useMemo(
    () => ({
      ...defaultThemeState,
      ...theme,
    }),
    [theme?.root, theme?.sub],
  );
  const [, setRootTheme] = useRootTheme();
  const [, setTheme] = useTheme();
  const themeState = useThemeState();
  const root =
    themeState.root ||
    (MultiPlatform.isServer
      ? (nextCookies?.[COOKIE_ROOT_THEME] as ColorScheme)
      : (localCookies?.[COOKIE_ROOT_THEME] as ColorScheme)) ||
    defaultThemeValue.root;
  const sub =
    themeState.sub ||
    (MultiPlatform.isServer
      ? (nextCookies?.[COOKIE_ROOT_THEME] as ColorScheme)
      : (localCookies?.[COOKIE_ROOT_THEME] as ColorScheme)) ||
    defaultThemeValue.sub;
  const value = React.useMemo(() => ({ root, sub }), [root, sub]);

  useEffect(() => {
    setTheme({ root, sub });
  }, [defaultThemeValue.root, defaultThemeValue.sub]);

  return (
    <ThemeContext.Provider value={value}>
      <NextThemeProvider
        onChangeTheme={(root: TamaguiColorScheme) => {
          setRootTheme(root);
        }}
        forcedTheme={root && root !== 'system' ? root : undefined}
      >
        {children}
      </NextThemeProvider>
    </ThemeContext.Provider>
  );
}
