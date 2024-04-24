import React from 'react';
import type { GlobalKeycloakProviderProps } from './keycloak';
import type { GlobalTamaguiProviderProps } from './tamagui';
import type { PropsWithChildren } from 'react';
import type { TamaguiInternalConfig } from 'ui';
import type { ThemeProviderProps } from 'multiplatform.one/theme';
import { GlobalApolloProvider } from './apollo';
import { GlobalKeycloakProvider } from './keycloak';
import { GlobalTamaguiProvider } from './tamagui';
import { ThemeProvider } from 'multiplatform.one/theme';

export type GlobalProviderKeycloak = Omit<GlobalKeycloakProviderProps, 'disabled' | 'children'>;

export type GlobalProviderProps = PropsWithChildren &
  Omit<GlobalTamaguiProviderProps, 'config'> & {
    keycloak?: GlobalProviderKeycloak;
    tamaguiConfig?: TamaguiInternalConfig;
  } & ThemeProviderProps;

export function GlobalProvider({ children, keycloak, tamaguiConfig, cookies, theme, ...props }: GlobalProviderProps) {
  return (
    <ThemeProvider cookies={cookies} theme={theme}>
      <GlobalTamaguiProvider config={tamaguiConfig} {...props}>
        <GlobalKeycloakProvider disabled={!keycloak} {...keycloak}>
          <GlobalApolloProvider>{children}</GlobalApolloProvider>
        </GlobalKeycloakProvider>
      </GlobalTamaguiProvider>
    </ThemeProvider>
  );
}

export * from './apollo';
export * from './keycloak';
export * from './tamagui';
