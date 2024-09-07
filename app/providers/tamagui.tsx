/**
 * File: /providers/tamagui.tsx
 * Project: app
 * File Created: 20-04-2024 14:53:30
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

import { TintFamiliesProvider } from "@multiplatform.one/components";
import { ToastProvider } from "@tamagui/toast";
import { useTheme } from "multiplatform.one/theme";
import React from "react";
import type { TamaguiProviderProps, ThemeName } from "ui";
import { TamaguiProvider, Theme, tintFamilies } from "ui";
import config from "../tamagui.config";

export type GlobalTamaguiProviderProps = Omit<
  TamaguiProviderProps,
  "config" | "defaultTheme"
> &
  Partial<Pick<TamaguiProviderProps, "config">>;

export function GlobalTamaguiProvider({
  children,
  ...props
}: GlobalTamaguiProviderProps) {
  const [theme] = useTheme();
  return (
    <TamaguiProvider
      disableInjectCSS={false}
      {...props}
      config={config || props.config}
    >
      <Theme name={theme.sub || ("gray" as ThemeName)}>
        <TintFamiliesProvider families={tintFamilies}>
          <ToastProvider>{children}</ToastProvider>
        </TintFamiliesProvider>
      </Theme>
    </TamaguiProvider>
  );
}
