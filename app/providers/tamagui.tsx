import React from 'react';
import config from '../tamagui.config';
import type { ReactNode } from 'react';
import type { TamaguiProviderProps as OriginalTamaguiProviderProps, ThemeName } from 'ui';
import { TamaguiProvider as OriginalTamaguiProvider, Theme } from 'ui';
import { useThemeState } from 'app/state/theme';

export type TamaguiProviderProps = Omit<OriginalTamaguiProviderProps, 'config'> &
  Partial<Pick<OriginalTamaguiProviderProps, 'config'>> & {
    defaultSubTheme?: ThemeName;
  };

export function TamaguiProvider({ children, ...props }: TamaguiProviderProps) {
  const themeState = useThemeState();
  const subTheme = props.defaultSubTheme || themeState.sub;

  function renderSubTheme(children: ReactNode) {
    if (!subTheme) return <>{children}</>;
    return <Theme name={subTheme}>{children}</Theme>;
  }

  if (!themeState.root) return renderSubTheme(children);
  return (
    <OriginalTamaguiProvider
      defaultTheme={themeState.root}
      disableInjectCSS={false}
      {...props}
      config={config || props.config}
    >
      {renderSubTheme(children)}
    </OriginalTamaguiProvider>
  );
}
