/**
 * File: /providers/navigation/index.native.tsx
 * Project: app
 * File Created: 10-10-2023 06:39:34
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

import * as Linking from 'expo-linking';
import React, { useMemo } from 'react';
import config from 'app/tamagui.config';
import type { PropsWithChildren } from 'react';
import type { Theme } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { routeMaps } from 'app/navigation/native';
import { useThemeState } from 'app/state/theme';

const initialRouteName = Object.entries(routeMaps).reduce(
  (initialRouteName: string, [key, value]: [string, string]) => {
    if (initialRouteName !== '') return initialRouteName;
    if (value === '') initialRouteName = key;
    return initialRouteName;
  },
  '',
);
const domain = 'multiplatform.one';

const themes: Record<'dark' | 'light', Theme> = {
  dark: {
    dark: true,
    colors: {
      background: config.themes.dark.background.val,
      border: config.themes.dark.borderColor.val,
      card: config.themes.dark.background.val,
      notification: config.themes.dark.background.val,
      primary: config.themes.dark.background.val,
      text: config.themes.dark.color.val,
    },
  },
  light: {
    dark: false,
    colors: {
      background: config.themes.light.background.val,
      border: config.themes.light.borderColor.val,
      card: config.themes.light.background.val,
      notification: config.themes.light.background.val,
      primary: config.themes.light.background.val,
      text: config.themes.light.color.val,
    },
  },
};

export interface GlobalNavigationProviderProps extends PropsWithChildren {}

export function GlobalNavigationProvider({ children }: GlobalNavigationProviderProps) {
  const themeState = useThemeState();

  return (
    <NavigationContainer
      theme={themes[themeState.root === 'dark' ? 'dark' : 'light']}
      linking={
        useMemo(
          () => ({
            prefixes: [
              Linking.createURL('/'),
              `https://${domain}/`,
              `https://*.${domain}/`,
              `http://${domain}/`,
              `http://*.${domain}/`,
            ],
            config: {
              initialRouteName,
              screens: routeMaps,
            },
          }),
          [],
        ) as any
      }
    >
      {children}
    </NavigationContainer>
  );
}
