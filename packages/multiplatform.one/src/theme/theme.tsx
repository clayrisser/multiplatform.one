/**
 * File: /src/theme/theme.tsx
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

import { useContext, useEffect, useMemo } from "react";
import { useCookies } from "react-cookie";
import { platform } from "../platform/index";
import {
  type ColorScheme,
  ThemeContext,
  type ThemeProviderProps,
  type ThemeState,
  defaultThemeState,
  useThemeStore,
} from "./shared";

export const COOKIE_ROOT_THEME = "multiplatform-one.root-theme";
export const COOKIE_SUB_THEME = "multiplatform-one.sub-theme";

export function useTheme(): [
  ThemeState,
  (theme: Partial<ThemeState>) => undefined,
] {
  const [, setCookie, removeCookie] = useCookies([
    COOKIE_ROOT_THEME,
    COOKIE_SUB_THEME,
  ]);
  const themeContextValue = useContext(ThemeContext);
  const themeStore = useThemeStore();
  return [
    {
      root: themeContextValue.root || "system",
      sub: themeContextValue.sub,
    },
    (theme: Partial<ThemeState>) => {
      if (typeof theme.root !== "undefined") {
        if (!theme.root || theme.root === "system") {
          removeCookie(COOKIE_ROOT_THEME);
          if (themeStore) themeStore.root = undefined;
        } else {
          setCookie(COOKIE_ROOT_THEME, theme.root);
          if (themeStore) themeStore.root = theme.root;
        }
      }
      if (typeof theme.sub !== "undefined") {
        if (!theme.sub) {
          removeCookie(COOKIE_SUB_THEME);
          if (themeStore) themeStore.sub = undefined;
        } else {
          setCookie(COOKIE_SUB_THEME, theme.sub);
          if (themeStore) themeStore.sub = theme.sub;
        }
      }
    },
  ];
}

export function ThemeProvider({
  children,
  cookies: nextCookies,
  theme,
}: ThemeProviderProps) {
  const [localCookies] = useCookies([COOKIE_ROOT_THEME, COOKIE_SUB_THEME]);
  const defaultThemeValue = useMemo(
    () => ({
      ...defaultThemeState,
      ...theme,
    }),
    [theme?.root, theme?.sub],
  );
  const [, setTheme] = useTheme();
  const themeStore = useThemeStore();
  const root =
    themeStore?.root ||
    (platform.isBrowser && platform.isServer
      ? (nextCookies?.[COOKIE_ROOT_THEME] as ColorScheme)
      : (localCookies?.[COOKIE_ROOT_THEME] as ColorScheme)) ||
    defaultThemeValue.root;
  const sub =
    themeStore?.sub ||
    (platform.isBrowser && platform.isServer
      ? (nextCookies?.[COOKIE_SUB_THEME] as ColorScheme)
      : (localCookies?.[COOKIE_SUB_THEME] as ColorScheme)) ||
    defaultThemeValue.sub;
  const value = useMemo(() => ({ root, sub }), [root, sub]);

  useEffect(() => {
    setTheme({ root, sub });
  }, [defaultThemeValue.root, defaultThemeValue.sub]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
