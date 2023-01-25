import React, { ComponentType, ReactNode } from 'react';
import { Select, ThemeName, YStack, ZStack, XStack } from 'ui';
import { config } from 'app/config';
import { useThemeState } from 'app/state/theme';

const rootThemeNames = ['light', 'dark'];
const subThemeNames = ['blue', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'yellow'];

export interface DebugLayoutProps {
  children: ReactNode;
}

export function DebugLayout({ children }) {
  const [theme, setTheme] = useThemeState();

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
    return subThemeNames.map((name: string, i: number) => {
      return (
        <Select.Item key={i + name} index={i} value={name}>
          <Select.ItemText>{name}</Select.ItemText>
        </Select.Item>
      );
    });
  }

  function renderRootThemeItems() {
    return rootThemeNames.map((name: string, i: number) => {
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
        <Select id="root-theme" value={theme.root} onValueChange={handleRootThemeChange}>
          <Select.Trigger w={96} py={0}>
            <Select.Value placeholder={theme.root} />
          </Select.Trigger>
          <Select.Adapt when="sm" platform="touch">
            <Select.Sheet modal dismissOnSnapToBottom>
              <Select.Sheet.Frame>
                <Select.Sheet.ScrollView>
                  <Select.Adapt.Contents />
                </Select.Sheet.ScrollView>
              </Select.Sheet.Frame>
              <Select.Sheet.Overlay />
            </Select.Sheet>
          </Select.Adapt>
          <Select.Content zIndex={99999}>
            <Select.Viewport>{renderRootThemeItems()}</Select.Viewport>
          </Select.Content>
        </Select>
        <Select id="sub-theme" value={theme.sub} onValueChange={handleSubThemeChange}>
          <Select.Trigger w={96} py={0} bc="$color5">
            <Select.Value placeholder={theme.sub} />
          </Select.Trigger>
          <Select.Adapt when="sm" platform="touch">
            <Select.Sheet modal dismissOnSnapToBottom>
              <Select.Sheet.Frame>
                <Select.Sheet.ScrollView>
                  <Select.Adapt.Contents />
                </Select.Sheet.ScrollView>
              </Select.Sheet.Frame>
              <Select.Sheet.Overlay />
            </Select.Sheet>
          </Select.Adapt>
          <Select.Content zIndex={200000}>
            <Select.Viewport>{renderSubThemeItems()}</Select.Viewport>
          </Select.Content>
        </Select>
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

export interface WithDebugLayoutProps {}

export function withDebugLayout<P extends WithDebugLayoutProps = WithDebugLayoutProps>(Component: ComponentType<P>) {
  return (props: P) => (
    <DebugLayout>
      <Component {...props} />
    </DebugLayout>
  );
}
