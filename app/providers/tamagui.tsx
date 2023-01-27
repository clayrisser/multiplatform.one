import config from '../tamagui.config';
import { useThemeState } from 'app/state/theme';
import { ReactNode } from 'react';
import {
  TamaguiProvider as OriginalTamaguiProvider,
  TamaguiProviderProps as OriginalTamaguiProviderProps,
  Theme,
} from '@multiplatform.one/ui';

export type TamaguiProviderProps = Omit<OriginalTamaguiProviderProps, 'config'>;

export function TamaguiProvider({ children, ...props }: TamaguiProviderProps) {
  const [theme] = useThemeState();

  function renderSubTheme(children: ReactNode) {
    if (!theme.sub) return children;
    return <Theme name={theme.sub}>{children}</Theme>;
  }

  return (
    <OriginalTamaguiProvider disableInjectCSS={false} config={config} defaultTheme={theme.root} {...props}>
      {renderSubTheme(children)}
    </OriginalTamaguiProvider>
  );
}
