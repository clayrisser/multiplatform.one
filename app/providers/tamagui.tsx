/**
 * File: /providers/tamagui.tsx
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

import React from 'react';
import config from '../tamagui.config';
import type { TamaguiProviderProps, ThemeName } from 'ui';
import { TamaguiProvider, Theme } from 'ui';
import { ToastProvider } from '@tamagui/toast';
import { useThemeState } from 'app/state/theme';

export type GlobalTamaguiProviderProps = Omit<TamaguiProviderProps, 'config'> &
  Partial<Pick<TamaguiProviderProps, 'config'>> & {
    defaultSubTheme?: ThemeName;
  };

export function GlobalTamaguiProvider({ children, ...props }: GlobalTamaguiProviderProps) {
  const themeState = useThemeState();
  const defaultTheme = props.defaultTheme || themeState.root;
  const subTheme = props.defaultSubTheme || themeState.sub || 'gray';

  return (
    <TamaguiProvider defaultTheme={defaultTheme} disableInjectCSS={false} {...props} config={config || props.config}>
      <Theme name={subTheme}>
        <ToastProvider>{children}</ToastProvider>
      </Theme>
    </TamaguiProvider>
  );
}
