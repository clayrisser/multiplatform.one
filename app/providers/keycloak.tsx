import React from 'react';
import type { AuthProviderProps } from '@multiplatform.one/keycloak';
import { AuthProvider } from '@multiplatform.one/keycloak';
import { config } from 'app/config';

export interface KeycloakProviderProps extends AuthProviderProps {}

export function KeycloakProvider({ children, debug, ssr, ...props }: KeycloakProviderProps) {
  if (config.get('KEYCLOAK_ENABLED') !== '1') return <>{children}</>;
  return (
    <AuthProvider {...props} debug={typeof debug !== 'undefined' ? debug : config.get('DEBUG') === '1'}>
      {children}
    </AuthProvider>
  );
}
