import React from 'react';
import config from '../tamagui.config';
import type { TamaguiProviderProps as OriginalTamaguiProviderProps, ThemeName } from 'ui';
import { TamaguiProvider as OriginalTamaguiProvider, Theme } from 'ui';
import { useThemeState } from 'app/state/theme';

export type TamaguiProviderProps = Omit<OriginalTamaguiProviderProps, 'config'> &
  Partial<Pick<OriginalTamaguiProviderProps, 'config'>> & {
    defaultSubTheme?: ThemeName;
  };

export function TamaguiProvider({ children, ...props }: TamaguiProviderProps) {
  const themeState = useThemeState();
  const defaultTheme = props.defaultTheme || themeState.root;
  const subTheme = props.defaultSubTheme || themeState.sub || 'gray';

  return (
    <OriginalTamaguiProvider
      defaultTheme={defaultTheme}
      disableInjectCSS={false}
      {...props}
      config={config || props.config}
    >
      <Theme name={subTheme}>{children}</Theme>
    </OriginalTamaguiProvider>
  );
}
