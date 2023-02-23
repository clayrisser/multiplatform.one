import type { KeycloakConfig, AuthConfig } from '@multiplatform.one/keycloak';
import type { KeycloakInitOptions } from 'keycloak-js';
import type { ProviderProps } from './types';
import { AuthProvider } from '@multiplatform.one/keycloak';
import { config } from 'app/config';

export interface KeycloakProviderProps extends ProviderProps {
  authConfig?: AuthConfig;
  cookies?: unknown;
  keycloak?: KeycloakConfig;
  keycloakInitOptions?: KeycloakInitOptions;
}

export function KeycloakProvider({ children, ...props }: KeycloakProviderProps) {
  if (config.get('KEYCLOAK_ENABLED') !== '1' || !props.keycloak) return <>{children}</>;
  return (
    <AuthProvider
      authConfig={props.authConfig}
      cookies={props.cookies}
      debug={config.get('DEBUG') === '1'}
      keycloakConfig={props.keycloak}
      keycloakInitOptions={props.keycloakInitOptions}
    >
      {children}
    </AuthProvider>
  );
}
