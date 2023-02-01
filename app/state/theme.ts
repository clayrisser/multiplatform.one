import { Actions, createStateStore } from 'multiplatform.one';
import { ThemeName } from 'ui';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';

const { useStore } = createStateStore<ThemeState, ThemeActions>('theme', {
  root: 'light',
  sub: 'purple',
});

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
  root: ThemeName;
  sub: ThemeName;
}

export type ThemeActions = Actions<ThemeState, {}>;
