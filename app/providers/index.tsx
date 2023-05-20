import React from 'react';
import type { KeycloakProviderProps } from './keycloak';
import type { ProviderProps } from './types';
import type { TamaguiInternalConfig, TamaguiProviderProps } from 'tamagui';
import { KeycloakProvider } from './keycloak';
import { NavigationProvider } from './navigation';
import { TamaguiProvider } from './tamagui';

export type GlobalProviderKeycloak = Omit<KeycloakProviderProps, 'disabled' | 'cookies' | 'children'>;

export type GlobalProviderProps = ProviderProps &
  Omit<TamaguiProviderProps, 'config'> & {
    cookies?: unknown;
    keycloak?: GlobalProviderKeycloak;
    noNavigation?: boolean;
    strict?: boolean;
    tamaguiConfig?: TamaguiInternalConfig;
  };

export function GlobalProvider({ children, keycloak, cookies, tamaguiConfig, ...props }: GlobalProviderProps) {
  if (keycloak) {
    children = (
      <KeycloakProvider cookies={cookies} {...keycloak}>
        {children}
      </KeycloakProvider>
    );
  }
  return (
    <TamaguiProvider config={tamaguiConfig} {...props}>
      <NavigationProvider>{children}</NavigationProvider>
    </TamaguiProvider>
  );
}

export * from './navigation';
export * from './tamagui';
export * from './types';
