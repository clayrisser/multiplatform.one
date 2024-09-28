/**
 * File: /src/theme/theme.native.tsx
 * Project: multiplatform.one
 * File Created: 01-01-1970 00:00:00
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

import React, { useContext, useEffect, useMemo } from "react";
import {
  ThemeContext,
  type ThemeProviderProps,
  type ThemeState,
  defaultThemeState,
  useThemeStore,
} from "./shared";

export function useTheme(): [
  ThemeState,
  (theme: Partial<ThemeState>) => undefined,
] {
  const themeContextValue = useContext(ThemeContext);
  const themeStore = useThemeStore();
  return [
    {
      root: themeContextValue.root || "system",
      sub: themeContextValue.sub,
    },
    (theme: Partial<ThemeState>) => {
      if (typeof theme.root !== "undefined") {
        if (theme.root === null || theme.root === "system") {
          if (themeStore) themeStore.root = undefined;
        } else {
          if (themeStore) themeStore.root = theme.root;
        }
      }
      if (typeof theme.sub !== "undefined") {
        if (theme.sub === null) {
          if (themeStore) themeStore.sub = undefined;
        } else {
          if (themeStore) themeStore.sub = theme.sub;
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
  const [, setTheme] = useTheme();
  const themeStore = useThemeStore();
  const root = themeStore?.root || defaultThemeValue.root;
  const sub = themeStore?.sub || defaultThemeValue.sub;
  const value = React.useMemo(() => ({ root, sub }), [root, sub]);

  useEffect(() => {
    setTheme({ root, sub });
  }, [defaultThemeValue.root, defaultThemeValue.sub]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
