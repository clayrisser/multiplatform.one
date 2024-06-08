/**
 * File: /src/main.tsx
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

import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { kcContext as kcAccountThemeContext } from './keycloak-theme/account/kcContext';
import { kcContext as kcLoginThemeContext } from './keycloak-theme/login/kcContext';

const App = lazy(() => import('./App'));
const KcAccountThemeApp = lazy(() => import('./keycloak-theme/account/KcApp'));
const KcLoginThemeApp = lazy(() => import('./keycloak-theme/login/KcApp'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense>
      {(() => {
        if (kcLoginThemeContext !== undefined) {
          return <KcLoginThemeApp kcContext={kcLoginThemeContext} />;
        }
        if (kcAccountThemeContext !== undefined) {
          return <KcAccountThemeApp kcContext={kcAccountThemeContext} />;
        }
        return <App />;
      })()}
    </Suspense>
  </StrictMode>,
);
