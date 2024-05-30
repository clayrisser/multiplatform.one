/*
 *  File: /state/theme.ts
 *  Project: app
 *  File Created: 10-10-2023 06:39:34
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

import type { Actions } from '@multiplatform.one/zustand';
import type { ThemeName } from 'ui';
import { createStateStore } from '@multiplatform.one/zustand';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';

const { useStore } = createStateStore<ThemeState, ThemeActions>(
  'theme',
  {
    root: 'light',
    sub: 'purple',
  },
  undefined,
  { persist: true },
);

export function useThemeState() {
  const scheme = useColorScheme();
  const themeStore = useStore();

  useEffect(() => {
    if (themeStore.root || !themeStore.setRoot) return;
    themeStore.setRoot(scheme === 'dark' ? 'dark' : 'light');
  }, [themeStore.root]);

  return themeStore;
}

export interface ThemeState {
  root: ColorScheme;
  sub: ThemeName;
}

export type ThemeActions = Actions<ThemeState>;

export type ColorScheme = 'dark' | 'light';
