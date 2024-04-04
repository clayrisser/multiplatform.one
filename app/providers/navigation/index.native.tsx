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
