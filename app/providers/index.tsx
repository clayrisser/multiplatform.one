import React, { useCallback } from 'react';
import type { KeycloakProviderProps } from './keycloak';
import type { ProviderProps } from './types';
import type { ReactNode } from 'react';
import type { TamaguiInternalConfig, TamaguiProviderProps } from 'tamagui';
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
  const renderKeycloakProvider = useCallback(
    (children: ReactNode) =>
      keycloak ? (
        <KeycloakProvider disabled={!!keycloak} cookies={cookies} {...keycloak}>
          <>{children}</>
        </KeycloakProvider>
      ) : (
        <>{children}</>
      ),
    [keycloak, cookies, children],
  );

  return renderKeycloakProvider(
    <TamaguiProvider config={tamaguiConfig} {...props}>
      <NavigationProvider>{children}</NavigationProvider>
    </TamaguiProvider>,
  );
}

export * from './navigation';
export * from './tamagui';
export * from './types';
