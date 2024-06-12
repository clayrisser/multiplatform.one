/**
 * File: /src/keycloak-theme/login/pages/Register.tsx
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

import { clsx } from 'keycloakify/tools/clsx';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { useGetClassName } from 'keycloakify/login/lib/useGetClassName';
import type { KcContext } from '../kcContext';
import type { I18n } from '../i18n';

export default function Register({
  kcContext,
  i18n,
  doUseDefaultCss,
  Template,
  classes,
}: PageProps<Extract<KcContext, { pageId: 'register.ftl' }>, I18n>) {
  const { getClassName } = useGetClassName({
    doUseDefaultCss,
    classes,
  });
  const { url, messagesPerField, register, realm, passwordRequired, recaptchaRequired, recaptchaSiteKey } = kcContext;
  const { msg, msgStr } = i18n;
  return (
    <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} headerNode={msg('registerTitle')}>
      <form id="kc-register-form" className={getClassName('kcFormClass')} action={url.registrationAction} method="post">
        <div
          className={clsx(
            getClassName('kcFormGroupClass'),
            messagesPerField.printIfExists('firstName', getClassName('kcFormGroupErrorClass')),
          )}
        >
          <div className={getClassName('kcLabelWrapperClass')}>
            <label htmlFor="firstName" className={getClassName('kcLabelClass')}>
              {msg('firstName')}
            </label>
          </div>
          <div className={getClassName('kcInputWrapperClass')}>
            <input
              type="text"
              id="firstName"
              className={getClassName('kcInputClass')}
              name="firstName"
              defaultValue={register.formData.firstName ?? ''}
            />
          </div>
        </div>
        <div
          className={clsx(
            getClassName('kcFormGroupClass'),
            messagesPerField.printIfExists('lastName', getClassName('kcFormGroupErrorClass')),
          )}
        >
          <div className={getClassName('kcLabelWrapperClass')}>
            <label htmlFor="lastName" className={getClassName('kcLabelClass')}>
              {msg('lastName')}
            </label>
          </div>
          <div className={getClassName('kcInputWrapperClass')}>
            <input
              type="text"
              id="lastName"
              className={getClassName('kcInputClass')}
              name="lastName"
              defaultValue={register.formData.lastName ?? ''}
            />
          </div>
        </div>
        <div
          className={clsx(
            getClassName('kcFormGroupClass'),
            messagesPerField.printIfExists('email', getClassName('kcFormGroupErrorClass')),
          )}
        >
          <div className={getClassName('kcLabelWrapperClass')}>
            <label htmlFor="email" className={getClassName('kcLabelClass')}>
              {msg('email')}
            </label>
          </div>
          <div className={getClassName('kcInputWrapperClass')}>
            <input
              type="text"
              id="email"
              className={getClassName('kcInputClass')}
              name="email"
              defaultValue={register.formData.email ?? ''}
              autoComplete="email"
            />
          </div>
        </div>
        {!realm.registrationEmailAsUsername && (
          <div
            className={clsx(
              getClassName('kcFormGroupClass'),
              messagesPerField.printIfExists('username', getClassName('kcFormGroupErrorClass')),
            )}
          >
            <div className={getClassName('kcLabelWrapperClass')}>
              <label htmlFor="username" className={getClassName('kcLabelClass')}>
                {msg('username')}
              </label>
            </div>
            <div className={getClassName('kcInputWrapperClass')}>
              <input
                type="text"
                id="username"
                className={getClassName('kcInputClass')}
                name="username"
                defaultValue={register.formData.username ?? ''}
                autoComplete="username"
              />
            </div>
          </div>
        )}
        {passwordRequired && (
          <>
            <div
              className={clsx(
                getClassName('kcFormGroupClass'),
                messagesPerField.printIfExists('password', getClassName('kcFormGroupErrorClass')),
              )}
            >
              <div className={getClassName('kcLabelWrapperClass')}>
                <label htmlFor="password" className={getClassName('kcLabelClass')}>
                  {msg('password')}
                </label>
              </div>
              <div className={getClassName('kcInputWrapperClass')}>
                <input
                  type="password"
                  id="password"
                  className={getClassName('kcInputClass')}
                  name="password"
                  autoComplete="new-password"
                />
              </div>
            </div>
            <div
              className={clsx(
                getClassName('kcFormGroupClass'),
                messagesPerField.printIfExists('password-confirm', getClassName('kcFormGroupErrorClass')),
              )}
            >
              <div className={getClassName('kcLabelWrapperClass')}>
                <label htmlFor="password-confirm" className={getClassName('kcLabelClass')}>
                  {msg('passwordConfirm')}
                </label>
              </div>
              <div className={getClassName('kcInputWrapperClass')}>
                <input
                  className={getClassName('kcInputClass')}
                  id="password-confirm"
                  name="password-confirm"
                  type="password"
                />
              </div>
            </div>
          </>
        )}
        {recaptchaRequired && (
          <div className="form-group">
            <div className={getClassName('kcInputWrapperClass')}>
              <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} />
            </div>
          </div>
        )}
        <div className={getClassName('kcFormGroupClass')}>
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
                getClassName('kcButtonBlockClass'),
                getClassName('kcButtonClass'),
                getClassName('kcButtonLargeClass'),
                getClassName('kcButtonPrimaryClass'),
              )}
              type="submit"
              value={msgStr('doRegister')}
            />
          </div>
        </div>
      </form>
    </Template>
  );
}
