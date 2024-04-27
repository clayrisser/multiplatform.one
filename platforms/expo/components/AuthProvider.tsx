/**
 * File: /components/AuthProvider.tsx
 * Project: @platform/expo
 * File Created: 27-04-2024 08:51:26
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createContext, useMemo, useContext, useEffect } from 'react';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';

import type { Actions } from 'multiplatform.one/zustand';
import { createStateStore } from 'multiplatform.one/zustand';

const logger = console;

export interface AuthState {
  accessToken?: string;
  idToken?: string;
  isSignedIn: boolean;
  userInfo?: any;
}

const { useStore: useAuthStore } = createStateStore<AuthState, Actions<AuthState, {}>>(
  'auth',
  {
    accessToken: undefined,
    idToken: undefined,
    isSignedIn: false,
    userInfo: undefined,
  },
  undefined,
  { persist: true },
);

export function useAuthState() {
  return useAuthStore();
}

export interface AuthContextValue {
  state: AuthState;
  signIn: () => void;
  signOut: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextValue>({
  state: { isSignedIn: false },
  signIn: () => undefined,
  signOut: () => undefined,
  hasRole: (_role: string) => false,
});

const keycloakUrl = 'http://localhost:8080/realms/main';
const keycloakClientId = 'expo';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const discovery = useAutoDiscovery(keycloakUrl);
  const redirectUri = makeRedirectUri();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: keycloakClientId,
      redirectUri: redirectUri,
      scopes: ['openid', 'profile'],
    },
    discovery,
  );

  const authState: AuthState = {
    isSignedIn: false,
  };

  const contextValue = useMemo(
    () => ({
      state: authState,
      signIn: () => {
        promptAsync();
      },
      signOut: async () => {
        try {
          await fetch(`${keycloakUrl}/protocol/openid-connect/logout?id_token_hint=${authState.idToken}`);
        } catch (err) {
          logger.error(err);
        }
      },
      hasRole: (role: string) => authState.userInfo?.roles.indexOf(role) !== -1,
    }),
    [authState, promptAsync],
  );

  useEffect(() => {
    // console.log('redirectUri', redirectUri);
    // console.log('request.codeVerifier', request?.codeVerifier);
    // console.log('response', response);
    (async () => {
      if (response?.type === 'success' && request?.codeVerifier && response.params.code) {
        const { code } = response.params;
        const codeVerifier = request.codeVerifier;
        console.log('code', code);
        console.log('codeVerifier', codeVerifier);
        console.log('redirectUri', redirectUri);
        const formData: Record<string, string> = {
          grant_type: 'authorization_code',
          client_id: keycloakClientId,
          code: code,
          code_verifier: codeVerifier,
          redirect_uri: redirectUri,
        };
        const formBody: string[] = [];
        Object.entries(formData).forEach(([key, value]) => {
          const encodedKey = encodeURIComponent(key);
          const encodedValue = encodeURIComponent(value);
          formBody.push(`${encodedKey}=${encodedValue}`);
        });
        const res = await fetch(`${keycloakUrl}/protocol/openid-connect/token`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody.join('&'),
        });
        if (res.ok) {
          const body = await res.json();
          console.log('body', body);
        }
      }
    })();
  }, [redirectUri, request?.codeVerifier, response]);

  useEffect(() => {
    // console.log('authState.accessToken', authState.accessToken);
    // console.log('authState.isSignedIn', authState.isSignedIn);
  }, [authState.accessToken, authState.isSignedIn]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
