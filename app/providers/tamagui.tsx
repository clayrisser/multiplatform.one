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
