import React from 'react';
import type { KeycloakProviderProps } from './keycloak';
import type { ProviderProps } from './types';
import type { TamaguiProviderProps } from 'ui';
import { KeycloakProvider } from './keycloak';
import { NavigationProvider } from './navigation';
import { StateProvider } from './state';
import { TamaguiProvider } from './tamagui';

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
