import React, { Suspense } from 'react';
import type { GlobalKeycloakProviderProps } from './keycloak';
import type { GlobalTamaguiProviderProps } from './tamagui';
import type { PropsWithChildren } from 'react';
import type { TamaguiInternalConfig } from 'ui';
import { GlobalApolloProvider } from './apollo';
import { GlobalKeycloakProvider } from './keycloak';
import { GlobalTamaguiProvider } from './tamagui';
import { GlobalNavigationProvider } from './navigation';

export type GlobalProviderKeycloak = Omit<GlobalKeycloakProviderProps, 'disabled' | 'children'>;

export type GlobalProviderProps = PropsWithChildren &
  Omit<GlobalTamaguiProviderProps, 'config'> & {
    keycloak?: GlobalProviderKeycloak;
    tamaguiConfig?: TamaguiInternalConfig;
  };

export function GlobalProvider({ children, keycloak, tamaguiConfig, ...props }: GlobalProviderProps) {
  return (
    <GlobalKeycloakProvider disabled={!keycloak} {...keycloak}>
      <GlobalApolloProvider>
        <GlobalTamaguiProvider config={tamaguiConfig} {...props}>
          <Suspense>
            <GlobalNavigationProvider>{children}</GlobalNavigationProvider>
          </Suspense>
        </GlobalTamaguiProvider>
      </GlobalApolloProvider>
    </GlobalKeycloakProvider>
  );
}

export * from './apollo/apollo';
export * from './keycloak';
export * from './navigation';
export * from './tamagui';
