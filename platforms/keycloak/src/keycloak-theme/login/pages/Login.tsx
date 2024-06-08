/**
 * File: /src/keycloak-theme/login/pages/Login.tsx
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

import type { I18n } from '../i18n';
import type { KcContext } from '../kcContext';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { clsx } from 'keycloakify/tools/clsx';
import { useConstCallback } from 'keycloakify/tools/useConstCallback';
import { useGetClassName } from 'keycloakify/login/lib/useGetClassName';
import { useState, type FormEventHandler } from 'react';

const my_custom_param = new URL(window.location.href).searchParams.get('my_custom_param');
if (my_custom_param !== null) console.log('my_custom_param:', my_custom_param);

export default function Login(props: PageProps<Extract<KcContext, { pageId: 'login.ftl' }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { getClassName } = useGetClassName({
    doUseDefaultCss,
    classes,
  });
  const { social, realm, url, usernameHidden, login, auth, registrationDisabled } = kcContext;
  const { msg, msgStr } = i18n;
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
  const onSubmit = useConstCallback<FormEventHandler<HTMLFormElement>>((e) => {
    e.preventDefault();
    setIsLoginButtonDisabled(true);
    const formElement = e.target as HTMLFormElement;
    formElement.querySelector("input[name='email']")?.setAttribute('name', 'username');
    formElement.submit();
  });

  return (
    <Template
      {...{ kcContext, i18n, doUseDefaultCss, classes }}
      displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
      displayWide={realm.password && social.providers !== undefined}
      headerNode={msg('doLogIn')}
      infoNode={
        <div id="kc-registration">
          <span>
            {msg('noAccount')}
            <a tabIndex={6} href={url.registrationUrl}>
              {msg('doRegister')}
            </a>
          </span>
        </div>
      }
    >
      <div
        id="kc-form"
        className={clsx(realm.password && social.providers !== undefined && getClassName('kcContentWrapperClass'))}
      >
        <div
          id="kc-form-wrapper"
          className={clsx(
            realm.password &&
              social.providers && [
                getClassName('kcFormSocialAccountContentClass'),
                getClassName('kcFormSocialAccountClass'),
              ],
          )}
        >
          {realm.password && (
            <form id="kc-form-login" onSubmit={onSubmit} action={url.loginAction} method="post">
              <div className={getClassName('kcFormGroupClass')}>
                {!usernameHidden &&
                  (() => {
                    const label = !realm.loginWithEmailAllowed
                      ? 'username'
                      : realm.registrationEmailAsUsername
                        ? 'email'
                        : 'usernameOrEmail';
                    const autoCompleteHelper: typeof label = label === 'usernameOrEmail' ? 'username' : label;
                    return (
                      <>
                        <label htmlFor={autoCompleteHelper} className={getClassName('kcLabelClass')}>
                          {msg(label)}
                        </label>
                        <input
                          autoComplete="off"
                          autoFocus={true}
                          className={getClassName('kcInputClass')}
                          defaultValue={login.username ?? ''}
                          id={autoCompleteHelper}
                          name={autoCompleteHelper}
                          tabIndex={1}
                          type="text"
                        />
                      </>
                    );
                  })()}
              </div>
              <div className={getClassName('kcFormGroupClass')}>
                <label htmlFor="password" className={getClassName('kcLabelClass')}>
                  {msg('password')}
                </label>
                <input
                  tabIndex={2}
                  id="password"
                  className={getClassName('kcInputClass')}
                  name="password"
                  type="password"
                  autoComplete="off"
                />
              </div>
              <div className={clsx(getClassName('kcFormGroupClass'), getClassName('kcFormSettingClass'))}>
                <div id="kc-form-options">
                  {realm.rememberMe && !usernameHidden && (
                    <div className="checkbox">
                      <label>
                        <input
                          tabIndex={3}
                          id="rememberMe"
                          name="rememberMe"
                          type="checkbox"
                          {...(login.rememberMe === 'on'
                            ? {
                                checked: true,
                              }
                            : {})}
                        />
                        {msg('rememberMe')}
                      </label>
                    </div>
                  )}
                </div>
                <div className={getClassName('kcFormOptionsWrapperClass')}>
                  {realm.resetPasswordAllowed && (
                    <span>
                      <a tabIndex={5} href={url.loginResetCredentialsUrl}>
                        {msg('doForgotPassword')}
                      </a>
                    </span>
                  )}
                </div>
              </div>
              <div id="kc-form-buttons" className={getClassName('kcFormGroupClass')}>
                <input
                  type="hidden"
                  id="id-hidden-input"
                  name="credentialId"
                  {...(auth?.selectedCredential !== undefined
                    ? {
                        value: auth.selectedCredential,
                      }
                    : {})}
                />
                <input
                  tabIndex={4}
                  className={clsx(
                    getClassName('kcButtonClass'),
                    getClassName('kcButtonPrimaryClass'),
                    getClassName('kcButtonBlockClass'),
                    getClassName('kcButtonLargeClass'),
                  )}
                  name="login"
                  id="kc-login"
                  type="submit"
                  value={msgStr('doLogIn')}
                  disabled={isLoginButtonDisabled}
                />
              </div>
            </form>
          )}
        </div>
        {realm.password && social.providers !== undefined && (
          <div
            id="kc-social-providers"
            className={clsx(getClassName('kcFormSocialAccountContentClass'), getClassName('kcFormSocialAccountClass'))}
          >
            <ul
              className={clsx(
                getClassName('kcFormSocialAccountListClass'),
                social.providers.length > 4 && getClassName('kcFormSocialAccountDoubleListClass'),
              )}
            >
              {social.providers.map((p) => (
                <li key={p.providerId} className={getClassName('kcFormSocialAccountListLinkClass')}>
                  <a href={p.loginUrl} id={`zocial-${p.alias}`} className={clsx('zocial', p.providerId)}>
                    <span>{p.displayName}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Template>
  );
}
