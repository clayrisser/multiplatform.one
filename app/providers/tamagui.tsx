import React from 'react';
import config from '../tamagui.config';
import type { TamaguiProviderProps, ThemeName } from 'ui';
import { TamaguiProvider, Theme, tintFamilies } from 'ui';
import { TintFamiliesProvider } from '@multiplatform.one/components';
import { ToastProvider } from '@tamagui/toast';
import { useTheme } from 'multiplatform.one/theme';

export type GlobalTamaguiProviderProps = Omit<TamaguiProviderProps, 'config'> &
  Partial<Pick<TamaguiProviderProps, 'config'>>;

export function GlobalTamaguiProvider({ children, ...props }: GlobalTamaguiProviderProps) {
  const [theme] = useTheme();
  return (
    <TamaguiProvider disableInjectCSS={false} {...props} config={config || props.config}>
      <Theme name={theme.sub || ('gray' as ThemeName)}>
        <TintFamiliesProvider families={tintFamilies}>
          <ToastProvider>{children}</ToastProvider>
        </TintFamiliesProvider>
      </Theme>
    </TamaguiProvider>
  );
}
