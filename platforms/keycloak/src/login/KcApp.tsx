/**
 * File: /src/login/KcApp.tsx
 * Project: @platform/keycloak
 * File Created: 12-06-2024 09:07:27
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

import Fallback from 'keycloakify/login';
import Template from './Template';
import tamaguiConfig from '../tamagui.config';
import type { KcContext } from './kcContext';
import type { PageProps } from 'keycloakify/login';
import type { ReactNode } from 'react';
import { GlobalProvider } from 'app/providers';
import { lazy, Suspense } from 'react';
import { useI18n } from './i18n';
import { useTheme } from 'multiplatform.one/theme';
// import LoginResetPassword from './pages/LoginResetPassword';
// import LoginUpdatePassword from './pages/LoginUpdatePassword';
// import LoginUpdateProfile from './pages/LoginUpdateProfile';

const Info = lazy(() => import('keycloakify/login/pages/Info'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const RegisterUserProfile = lazy(() => import('./pages/RegisterUserProfile'));
const Terms = lazy(() => import('./pages/Terms'));
const LoginResetPassword = lazy(() => import('./pages/LoginResetPassword'));
const LoginUpdatePassword = lazy(() => import('./pages/LoginUpdatePassword'));
const LoginUpdateProfile = lazy(() => import('./pages/LoginUpdateProfile'));
const classes: PageProps<any, any>['classes'] = {};

function Provider({ children }: { children?: ReactNode }) {
  const [theme] = useTheme();
  return (
    <GlobalProvider tamaguiConfig={tamaguiConfig} theme={theme}>
      {children}
    </GlobalProvider>
  );
}

export default function KcApp({ kcContext }: { kcContext: KcContext }) {
  console.log('KcContextId =====>>>>', kcContext.pageId);
  const i18n = useI18n({ kcContext });
  if (i18n === null) return <Provider />;
  return (
    <Provider>
      <Suspense>
        {(() => {
          switch (kcContext.pageId) {
            case 'login.ftl':
              return <Login {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
            case 'register.ftl':
              return <Register {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
            case 'register-user-profile.ftl':
              return <RegisterUserProfile {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
            case 'terms.ftl':
              return <Terms {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
            case 'info.ftl':
              return (
                <Info
                  {...{ kcContext, i18n, classes }}
                  Template={lazy(() => import('keycloakify/login/Template'))}
                  doUseDefaultCss={true}
                />
              );
            case 'login-reset-password.ftl':
              return <LoginResetPassword {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;

            case 'login-update-password.ftl':
              return <LoginUpdatePassword {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;

            case 'login-update-profile.ftl':
              return <LoginUpdateProfile {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
            default:
              return <Fallback {...{ kcContext, i18n, classes }} Template={Template} doUseDefaultCss={true} />;
          }
        })()}
      </Suspense>
    </Provider>
  );
}
