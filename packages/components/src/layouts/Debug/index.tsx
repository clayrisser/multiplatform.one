import React from 'react';
import type { ComponentType, ReactNode } from 'react';
import type { ThemeName } from 'tamagui';
import type { WithLayout } from 'multiplatform.one';
import { Select, YStack, ZStack, XStack, Adapt, Popover, Circle } from 'tamagui';
import { SelectSimple } from '../../forms/SelectSimple';
import { createWithLayout, useLocale, useSupportedLocales } from 'multiplatform.one';
// @ts-ignore
import { config } from 'app/config';
// @ts-ignore
import { useThemeState } from 'app/state/theme';

type ColorScheme = 'dark' | 'light';

export interface DebugLayoutProps<DebugViewProps> {
  children: ReactNode;
  debugView?: ComponentType<DebugViewProps>;
  debugViewProps?: DebugViewProps;
  rootThemeNames?: string[];
  subThemeNames?: string[];
}

export function DebugLayout<DebugViewProps>({
  children,
  debugView,
  debugViewProps,
  rootThemeNames,
  subThemeNames,
}: DebugLayoutProps<DebugViewProps>) {
  const DebugView = debugView;
  const [locale, setLocale] = useLocale();
  const themeState = useThemeState();
  const supportedLocales = useSupportedLocales();

  function handleSubThemeChange(subTheme: ThemeName) {
    themeState.setSub(subTheme);
  }

  function handleRootThemeChange(rootTheme: ThemeName) {
    themeState.setRoot(rootTheme as ColorScheme);
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

  function renderDebug() {
    return (
      <XStack space padding="$4" zIndex={9999}>
        <Popover placement="right" size="$5">
          <Popover.Trigger>
            <Circle cursor="pointer" backgroundColor="$color9" width={8} height={8} />
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
            <XStack space>
              <SelectSimple
                id="root-theme"
                placeholder={themeState.root}
                width={96}
                value={themeState.root}
                onValueChange={handleRootThemeChange}
              >
                {renderRootThemeItems()}
              </SelectSimple>
              <SelectSimple
                id="sub-theme"
                placeholder={themeState.sub}
                width={96}
                backgroundColor="$color5"
                value={themeState.sub}
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
            </XStack>
            {DebugView && <DebugView {...(debugViewProps as any)} />}
          </Popover.Content>
        </Popover>
      </XStack>
    );
  }

  if (config.get('DEBUG') !== '1') {
    return <>{children}</>;
  }
  return (
    <ZStack fullscreen>
      {renderDebug()}
      <YStack fullscreen>{children}</YStack>
    </ZStack>
  );
}

DebugLayout.defaultProps = {
  rootThemeNames: ['light', 'dark'],
  subThemeNames: ['blue', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'yellow'],
};

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
