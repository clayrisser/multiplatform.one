/**
 * File: /src/layouts/Debug/index.tsx
 * Project: @multiplatform.one/components
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
import type { ComponentType, ReactNode } from 'react';
import type { ThemeName } from 'tamagui';
import type { WithLayout } from 'multiplatform.one';
import { Select, YStack, XStack, Adapt, Popover, Circle } from 'tamagui';
import { SelectSimple } from '../../forms/SelectSimple';
import { createWithLayout } from 'multiplatform.one';
import { useLocale, useSupportedLocales } from '@multiplatform.one/locales';
import { useTheme } from 'multiplatform.one/theme';
import { useTint } from '../../tints';
// @ts-ignore
import { config } from 'app/config';

type ColorScheme = 'dark' | 'light';

export interface DebugLayoutProps<DebugViewProps> {
  children: ReactNode;
  debugView?: ComponentType<DebugViewProps>;
  debugViewProps?: DebugViewProps;
  rootThemeNames?: string[];
  size?: number;
  subThemeNames?: string[];
}

export function DebugLayout<DebugViewProps>({
  children,
  debugView,
  debugViewProps,
  rootThemeNames = ['system', 'light', 'dark'],
  size = 12,
  subThemeNames = ['blue', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'yellow'],
}: DebugLayoutProps<DebugViewProps>) {
  const { familiesNames, setFamily, name } = useTint();
  const DebugView = debugView;
  const [theme, setTheme] = useTheme();
  const [locale, setLocale] = useLocale();
  const supportedLocales = useSupportedLocales();

  function handleSubThemeChange(subTheme: ThemeName) {
    setTheme({ sub: subTheme });
  }

  function handleRootThemeChange(rootTheme: ColorScheme) {
    setTheme({ root: rootTheme });
  }

  function renderSubThemeItems() {
    return (subThemeNames || []).map((name: string, i: number) => {
      return (
        <Select.Item key={i + name} index={i} value={name}>
          <Select.ItemText>{name}</Select.ItemText>
        </Select.Item>
      );
    });
  }

  function renderRootThemeItems() {
    return (rootThemeNames || []).map((name: string, i: number) => {
      return (
        <Select.Item key={i + name} index={i} value={name}>
          <Select.ItemText>{name}</Select.ItemText>
        </Select.Item>
      );
    });
  }

  function renderLocaleItems() {
    return (supportedLocales || []).map((name: string, i: number) => {
      return (
        <Select.Item key={i + name} index={i} value={name}>
          <Select.ItemText>{name}</Select.ItemText>
        </Select.Item>
      );
    });
  }

  function renderTintFamilyItems() {
    return familiesNames.map((name, i) => {
      return (
        <Select.Item key={i + name} index={i} value={name}>
          <Select.ItemText>{name}</Select.ItemText>
        </Select.Item>
      );
    });
  }

  function renderDebug() {
    return (
      <XStack gap m="$4" width={size} height={size}>
        <Popover placement="right" size="$5">
          <Popover.Trigger>
            <Circle cursor="pointer" backgroundColor="$color9" width={size} height={size} />
          </Popover.Trigger>
          <Adapt>
            <Popover.Sheet modal dismissOnSnapToBottom>
              <Popover.Sheet.Frame padding="$4">
                <Adapt.Contents />
              </Popover.Sheet.Frame>
              <Popover.Sheet.Overlay />
            </Popover.Sheet>
          </Adapt>
          <Popover.Content borderWidth={1} borderColor="$borderColor" elevate>
            <XStack gap>
              <SelectSimple
                id="root-theme"
                placeholder={theme.root}
                width={96}
                value={theme.root || 'system'}
                onValueChange={handleRootThemeChange}
              >
                {renderRootThemeItems()}
              </SelectSimple>
              <SelectSimple
                id="sub-theme"
                placeholder={theme.sub}
                width={96}
                backgroundColor="$color5"
                value={theme.sub?.toString()}
                onValueChange={handleSubThemeChange}
              >
                {renderSubThemeItems()}
              </SelectSimple>
              <SelectSimple
                id="locales"
                width={96}
                placeholder={locale}
                backgroundColor="$color10"
                value={locale}
                onValueChange={setLocale}
              >
                {renderLocaleItems()}
              </SelectSimple>
              <SelectSimple
                id="tint-families"
                width={96}
                placeholder={name.toString()}
                backgroundColor="$color10"
                value={name.toString()}
                onValueChange={setFamily}
              >
                {renderTintFamilyItems()}
              </SelectSimple>
            </XStack>
            {DebugView && <DebugView {...(debugViewProps as any)} />}
          </Popover.Content>
        </Popover>
      </XStack>
    );
  }

  if (config.get('DEBUG') !== '1') return <>{children}</>;
  return (
    <YStack fullscreen>
      {children}
      <YStack position="absolute">{renderDebug()}</YStack>
    </YStack>
  );
}

export function createWithDebugLayout<DebugViewProps>(
  extraLayouts?: WithLayout<any>[],
  debugLayoutProps: CreateWithDebugLayout<DebugViewProps> = {},
) {
  return createWithLayout(DebugLayout, extraLayouts, debugLayoutProps);
}

export const withDebugLayout = createWithDebugLayout();

interface CreateWithDebugLayout<DebugViewProps> {
  debugView?: ComponentType<DebugViewProps>;
  debugViewProps?: DebugViewProps;
  rootThemeNames?: string[];
  subThemeNames?: string[];
}
