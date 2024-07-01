/**
 * File: /src/login/pages/LoginResetPassword.tsx
 * Project: @platform/keycloak
 * File Created: 01-07-2024 16:49:14
 * Author: Lalit rajak
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

import { clsx } from 'keycloakify/tools/clsx';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { useGetClassName } from 'keycloakify/login/lib/useGetClassName';
import type { KcContext } from '../kcContext';
import type { I18n } from '../i18n';

export default function LoginResetPassword(
  props: PageProps<Extract<KcContext, { pageId: 'login-reset-password.ftl' }>, I18n>,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { getClassName } = useGetClassName({
    doUseDefaultCss,
    classes,
  });

  const { url, realm, auth } = kcContext;

  const { msg, msgStr } = i18n;

  return (
    <Template
      {...{ kcContext, i18n, doUseDefaultCss, classes }}
      displayMessage={false}
      headerNode={msg('emailForgotTitle')}
      infoNode={msg('emailInstruction')}
    >
      <form id="kc-reset-password-form" className={getClassName('kcFormClass')} action={url.loginAction} method="post">
        <div className={getClassName('kcFormGroupClass')}>
          <div className={getClassName('kcLabelWrapperClass')}>
            <label htmlFor="username" className={getClassName('kcLabelClass')}>
              {!realm.loginWithEmailAllowed
                ? msg('username')
                : !realm.registrationEmailAsUsername
                  ? msg('usernameOrEmail')
                  : msg('email')}
            </label>
          </div>
          <div className={getClassName('kcInputWrapperClass')}>
            <input
              type="text"
              id="username"
              name="username"
              className={getClassName('kcInputClass')}
              autoFocus
              defaultValue={auth !== undefined && auth.showUsername ? auth.attemptedUsername : undefined}
            />
          </div>
        </div>
        <div className={clsx(getClassName('kcFormGroupClass'), getClassName('kcFormSettingClass'))}>
          <div id="kc-form-options" className={getClassName('kcFormOptionsClass')}>
            <div className={getClassName('kcFormOptionsWrapperClass')}>
              <span>
                <a href={url.loginUrl}>{msg('backToLogin')}</a>
              </span>
            </div>
          </div>

          <div id="kc-form-buttons" className={getClassName('kcFormButtonsClass')}>
            <input
              className={clsx(
                getClassName('kcButtonClass'),
                getClassName('kcButtonPrimaryClass'),
                getClassName('kcButtonBlockClass'),
                getClassName('kcButtonLargeClass'),
              )}
              type="submit"
              value={msgStr('doSubmit')}
            />
          </div>
        </div>
      </form>
    </Template>
  );
}
