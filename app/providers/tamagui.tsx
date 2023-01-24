import config from '../tamagui.config';
import { useColorScheme } from 'react-native';
import {
  TamaguiProvider as OriginalTamaguiProvider,
  TamaguiProviderProps as OriginalTamaguiProviderProps,
} from 'tamagui';

export type TamaguiProviderProps = Omit<OriginalTamaguiProviderProps, 'config'>;

export function TamaguiProvider({ children, ...props }: TamaguiProviderProps) {
  const scheme = useColorScheme();
  return (
    <OriginalTamaguiProvider
      config={config}
      disableInjectCSS={false}
      defaultTheme={scheme === 'dark' ? 'dark' : 'light'}
      {...props}
    >
      {children}
    </OriginalTamaguiProvider>
  );
}
