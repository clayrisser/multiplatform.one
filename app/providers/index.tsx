import type { ProviderProps } from './types';
import { NavigationProvider } from './navigation';
import { StateProvider } from './state/index';
import { TamaguiProvider } from './tamagui';
import { TamaguiProviderProps } from 'tamagui';
import { KeycloakProvider, KeycloakProviderProps } from './keycloak';

export type GlobalProviderProps = ProviderProps &
  KeycloakProviderProps &
  Omit<TamaguiProviderProps, 'config'> & {
    noNavigation?: boolean;
    strict?: boolean;
  };

export function GlobalProvider({ children, ...props }: GlobalProviderProps) {
  return (
    <TamaguiProvider {...props}>
      <StateProvider>
        <NavigationProvider>
          <KeycloakProvider
            authConfig={props.authConfig}
            cookies={props.cookies}
            keycloak={props.keycloak}
            keycloakInitOptions={props.keycloakInitOptions}
          >
            {children}
          </KeycloakProvider>
        </NavigationProvider>
      </StateProvider>
    </TamaguiProvider>
  );
}

export * from './navigation';
export * from './state/index';
export * from './tamagui';
export * from './types';
