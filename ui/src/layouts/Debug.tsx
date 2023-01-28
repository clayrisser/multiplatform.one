import React, { ComponentType, ReactNode } from 'react';
import { Select, ThemeName, YStack, ZStack, XStack, Adapt, Popover, Circle } from 'tamagui';
import { SelectSimple } from '../forms/SelectSimple';
// @ts-ignore
import { config } from 'app/config';
import { createWithLayout, WithLayout } from '../helpers';
// @ts-ignore
import { supportedLocales, useLocale } from 'app/i18n';
// @ts-ignore
import { useThemeState } from 'app/state/theme';

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
  const [theme, setTheme] = useThemeState();
  const [locale, setLocale] = useLocale();

  function handleSubThemeChange(subTheme: ThemeName) {
    setTheme((theme) => ({
      ...theme,
      sub: subTheme,
    }));
  }

  function handleRootThemeChange(rootTheme: ThemeName) {
    setTheme((theme) => ({
      ...theme,
      root: rootTheme,
    }));
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
    return supportedLocales.map((name: string, i: number) => {
      return (
        <Select.Item key={i + name} index={i} value={name}>
          <Select.ItemText>{name}</Select.ItemText>
        </Select.Item>
      );
    });
  }

  function renderDebug() {
    return (
      <XStack space p="$4" zi={9999}>
        <Popover placement="right" size="$5">
          <Popover.Trigger>
            <Circle cursor="pointer" bg="$color9" w={8} h={8} />
          </Popover.Trigger>
          <Adapt>
            <Popover.Sheet modal dismissOnSnapToBottom>
              <Popover.Sheet.Frame padding="$4">
                <Adapt.Contents />
              </Popover.Sheet.Frame>
              <Popover.Sheet.Overlay />
            </Popover.Sheet>
          </Adapt>
          <Popover.Content bw={1} boc="$borderColor" elevate>
            <Popover.Arrow bw={1} boc="$borderColor" />
            <XStack space>
              <SelectSimple
                id="root-theme"
                placeholder={theme.root}
                w={96}
                value={theme.root}
                onValueChange={handleRootThemeChange}
              >
                {renderRootThemeItems()}
              </SelectSimple>
              <SelectSimple
                id="sub-theme"
                placeholder={theme.sub}
                w={96}
                bc="$color5"
                value={theme.sub}
                onValueChange={handleSubThemeChange}
              >
                {renderSubThemeItems()}
              </SelectSimple>
              <SelectSimple
                id="locales"
                w={96}
                placeholder={locale}
                bc="$color10"
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

  if (config.get('DEBUG') !== '1') return <>{children}</>;
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

interface CreateWithDebugLayout<DebugViewProps> {
  debugView?: ComponentType<DebugViewProps>;
  debugViewProps?: DebugViewProps;
  rootThemeNames?: string[];
  subThemeNames?: string[];
}
