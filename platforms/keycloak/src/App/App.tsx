/**
 * File: /src/App/App.tsx
 * Project: @platform/keycloak
 * File Created: 08-06-2024 10:54:54
 * Author: Clay Risser
 * Author: Joseph Garrone
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

import './App.css';
import reactSvgUrl from './assets/react.svg';
import viteSvgUrl from './assets/vite.svg';
import { OidcProvider, useOidc, getKeycloakAccountUrl } from './oidc';

export default function App() {
  return (
    // To integrate Keycloak to your React App you have many options such as:
    // - https://www.npmjs.com/package/keycloak-js
    // - https://github.com/authts/oidc-client-ts
    // - https://github.com/authts/react-oidc-context
    // In this starter we use oidc-spa instead
    // It's a new library made by us, the Keycloakify team.
    // Check it out: https://github.com/keycloakify/oidc-spa
    <OidcProvider>
      <ContextualizedApp />
    </OidcProvider>
  );
}

function ContextualizedApp() {
  const { isUserLoggedIn, login, logout, oidcTokens } = useOidc();
  return (
    <div className="App">
      <div>
        <div className="App-payload">
          {isUserLoggedIn ? (
            <>
              <h1>Hello {oidcTokens.decodedIdToken.name} !</h1>
              <a href={getKeycloakAccountUrl({ locale: 'en' })}>Link to your Keycloak account</a>
              &nbsp;&nbsp;&nbsp;
              <button onClick={() => logout({ redirectTo: 'home' })}>Logout</button>
              <Jwt />
            </>
          ) : (
            <button
              onClick={() =>
                login({
                  doesCurrentHrefRequiresAuth: false,
                })
              }
            >
              Login
            </button>
          )}
        </div>
        <div className="App-logo-wrapper">
          <img src={reactSvgUrl} className="App-logo rotate" alt="logo" />
          &nbsp;&nbsp;&nbsp;
          <img src={viteSvgUrl} className="App-logo" alt="logo" />
        </div>
      </div>
    </div>
  );
}

function Jwt() {
  const { oidcTokens } = useOidc({
    assertUserLoggedIn: true,
  });
  return <pre style={{ textAlign: 'left' }}>{JSON.stringify(oidcTokens.decodedIdToken, null, 2)}</pre>;
}
