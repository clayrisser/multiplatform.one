import config from '../tamagui.config';
import { useThemeState } from 'app/state/theme';
import { ReactNode } from 'react';
import {
  TamaguiProvider as OriginalTamaguiProvider,
  TamaguiProviderProps as OriginalTamaguiProviderProps,
  Theme,
} from 'tamagui';

export type TamaguiProviderProps = Omit<OriginalTamaguiProviderProps, 'config'>;

export function TamaguiProvider({ children, ...props }: TamaguiProviderProps) {
  const themeState = useThemeState();

  function renderSubTheme(children: ReactNode) {
    if (!themeState.sub) return children;
    return <Theme name={themeState.sub}>{children}</Theme>;
  }

  return (
    <OriginalTamaguiProvider disableInjectCSS={false} config={config} defaultTheme={themeState.root} {...props}>
      {renderSubTheme(children)}
    </OriginalTamaguiProvider>
  );
}
