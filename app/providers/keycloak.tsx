import React from 'react';
import type { KeycloakProviderProps } from '@multiplatform.one/keycloak';
import { KeycloakProvider } from '@multiplatform.one/keycloak';
import { config } from 'app/config';

export interface GlobalKeycloakProviderProps extends KeycloakProviderProps {}

export function GlobalKeycloakProvider({ children, debug, ...props }: KeycloakProviderProps) {
  if (config.get('KEYCLOAK_ENABLED') !== '1') return <>{children}</>;
  return (
    <KeycloakProvider
      {...props}
      debug={
        false
        // typeof debug !== 'undefined' ? debug : config.get('DEBUG') === '1'
      }
    >
      {children}
    </KeycloakProvider>
  );
}
