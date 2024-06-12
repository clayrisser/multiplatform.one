/**
 * File: /src/keycloak-theme/login/KcApp.tsx
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

import './KcApp.css';
import Fallback, { type PageProps } from 'keycloakify/login';
import Template from './Template';
import type { KcContext } from './kcContext';
import { lazy, Suspense } from 'react';
import { useI18n } from './i18n';

const Info = lazy(() => import('keycloakify/login/pages/Info'));
const Login = lazy(() => import('./pages/Login'));
const MyExtraPage1 = lazy(() => import('./pages/MyExtraPage1'));
const MyExtraPage2 = lazy(() => import('./pages/MyExtraPage2'));
const Register = lazy(() => import('./pages/Register'));
const RegisterUserProfile = lazy(() => import('./pages/RegisterUserProfile'));
const Terms = lazy(() => import('./pages/Terms'));

const classes: PageProps<any, any>['classes'] = {
  kcHtmlClass: 'my-root-class',
  kcHeaderWrapperClass: 'my-color my-font',
};

export default function KcApp({ kcContext }: { kcContext: KcContext }) {
  const i18n = useI18n({ kcContext });
  if (i18n === null) return <>{}</>;
  return (
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
          case 'my-extra-page-1.ftl':
            return <MyExtraPage1 {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
          case 'my-extra-page-2.ftl':
            return <MyExtraPage2 {...{ kcContext, i18n, Template, classes }} doUseDefaultCss={true} />;
          case 'info.ftl':
            return (
              <Info
                {...{ kcContext, i18n, classes }}
                Template={lazy(() => import('keycloakify/login/Template'))}
                doUseDefaultCss={true}
              />
            );
          default:
            return <Fallback {...{ kcContext, i18n, classes }} Template={Template} doUseDefaultCss={true} />;
        }
      })()}
    </Suspense>
  );
}
