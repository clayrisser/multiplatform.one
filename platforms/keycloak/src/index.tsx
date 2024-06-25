/**
 * File: /src/index.tsx
 * Project: @platform/keycloak
 * File Created: 12-06-2024 12:15:42
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

import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { kcContext as kcAccountThemeContext } from './account/kcContext';
import { kcContext as kcLoginThemeContext } from './login/kcContext';

declare global {
  interface Window {
    process: any;
  }
}

if (!window.process) window.process = {};
if (!window.process.env) window.process.env = {};

const KcAccountThemeApp = lazy(() => import('./account/KcApp'));
const KcLoginThemeApp = lazy(() => import('./login/KcApp'));

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
        throw new Error('This app is a Keycloak theme and is not meant to be deployed outside of Keycloak');
      })()}
    </Suspense>
  </StrictMode>,
);
