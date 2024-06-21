import React, { useMemo } from 'react';
import { config } from 'app/config';
import { useKeycloak } from '@multiplatform.one/keycloak';
import type { GlobalUrqlProviderProps } from './urql';
import { createClient, fetchExchange, subscriptionExchange } from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import { Provider as UrqlProvider } from 'urql';

export function GlobalUrqlProvider({ children, keycloakDisabled }: GlobalUrqlProviderProps) {
  const keycloak = useKeycloak();
  const client = useMemo(() => {
    const headers = keycloakDisabled ? {} : { ...(keycloak ? { Authorization: `Bearer ${keycloak?.token}` } : {}) };
    const uri = (config.get('API_BASE_URL') || 'http://localhost:5001') + '/graphql';
    return createClient({
      url: uri.replace(/^http/, 'ws'),
      exchanges: [devtoolsExchange, fetchExchange],
      fetchOptions: {
        headers: headers,
      },
    });
  }, [keycloak?.authenticated, keycloakDisabled]);

  return <UrqlProvider value={client}>{children}</UrqlProvider>;
}
