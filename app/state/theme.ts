import type { Actions } from 'multiplatform.one/zustand';
import type { ThemeName } from 'tamagui';
import { createStateStore } from 'multiplatform.one/zustand';
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

export type ThemeActions = Actions<ThemeState, {}>;

export type ColorScheme = 'dark' | 'light';
