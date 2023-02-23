import React from 'react';
import config from '../tamagui.config';
import type { ReactNode } from 'react';
import type { TamaguiProviderProps as OriginalTamaguiProviderProps } from 'ui';
import { TamaguiProvider as OriginalTamaguiProvider, Theme } from 'ui';
import { useThemeState } from 'app/state/theme';

export type TamaguiProviderProps = Omit<OriginalTamaguiProviderProps, 'config'>;

export function TamaguiProvider({ children, ...props }: TamaguiProviderProps) {
  const themeState = useThemeState();

  function renderSubTheme(children: ReactNode) {
    if (!themeState.sub) return <>{children}</>;
    return <Theme name={themeState.sub}>{children}</Theme>;
  }

  return (
    <OriginalTamaguiProvider disableInjectCSS={false} config={config} defaultTheme={themeState.root} {...props}>
      {renderSubTheme(children)}
    </OriginalTamaguiProvider>
  );
}
