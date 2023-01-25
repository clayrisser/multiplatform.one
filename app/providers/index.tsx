import type { ProviderProps } from './types';
import { NavigationProvider } from './navigation';
import { StateProvider } from './state';
import { TamaguiProvider } from './tamagui';
import { TamaguiProviderProps } from 'ui';
import { KeycloakProvider, KeycloakProviderProps } from './keycloak';

export type GlobalProviderProps = ProviderProps &
  KeycloakProviderProps &
  Omit<TamaguiProviderProps, 'config'> & {
    noNavigation?: boolean;
    strict?: boolean;
    disableStateProvider?: boolean;
  };

export function GlobalProvider({ children, ...props }: GlobalProviderProps) {
  return (
    <StateProvider disable={props.disableStateProvider}>
      <TamaguiProvider {...props}>
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
      </TamaguiProvider>
    </StateProvider>
  );
}

export * from './navigation';
export * from './state';
export * from './tamagui';
export * from './types';
