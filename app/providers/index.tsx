import React, { Suspense } from 'react';
import type { KeycloakProviderProps } from './keycloak';
import type { ProviderProps } from './types';
import type { TamaguiInternalConfig } from 'ui';
import type { TamaguiProviderProps } from './tamagui';
import { KeycloakProvider } from './keycloak';
import { NavigationProvider } from './navigation';
import { TamaguiProvider } from './tamagui';

export type GlobalProviderKeycloak = Omit<KeycloakProviderProps, 'disabled' | 'cookies' | 'children'>;

export type GlobalProviderProps = ProviderProps &
  Omit<TamaguiProviderProps, 'config'> & {
    cookies?: unknown;
    keycloak?: GlobalProviderKeycloak;
    tamaguiConfig?: TamaguiInternalConfig;
  };

export function GlobalProvider({ children, keycloak, cookies, tamaguiConfig, ...props }: GlobalProviderProps) {
  return (
    <KeycloakProvider disabled={!keycloak} cookies={cookies} {...keycloak}>
      <TamaguiProvider config={tamaguiConfig} {...props}>
        <Suspense>
          <NavigationProvider>{children}</NavigationProvider>
        </Suspense>
      </TamaguiProvider>
    </KeycloakProvider>
  );
}

export * from './navigation';
export * from './tamagui';
export * from './types';
