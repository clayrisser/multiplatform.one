/**
 * File: /src/keycloak-theme/login/pages/RegisterUserProfile.tsx
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
import { UserProfileFormFields } from './shared/UserProfileFormFields';
import { clsx } from 'keycloakify/tools/clsx';
import { useGetClassName } from 'keycloakify/login/lib/useGetClassName';
import { useState } from 'react';

export default function RegisterUserProfile(
  props: PageProps<Extract<KcContext, { pageId: 'register-user-profile.ftl' }>, I18n>,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { getClassName } = useGetClassName({
    doUseDefaultCss,
    classes,
  });
  const { url, messagesPerField, recaptchaRequired, recaptchaSiteKey } = kcContext;
  const { msg, msgStr } = i18n;
  const [isFormSubmittable, setIsFormSubmittable] = useState(false);

  return (
    <Template
      {...{ kcContext, i18n, doUseDefaultCss, classes }}
      displayMessage={messagesPerField.exists('global')}
      displayRequiredFields={true}
      headerNode={msg('registerTitle')}
    >
      <form id="kc-register-form" className={getClassName('kcFormClass')} action={url.registrationAction} method="post">
        <UserProfileFormFields
          kcContext={kcContext}
          onIsFormSubmittableValueChange={setIsFormSubmittable}
          i18n={i18n}
          getClassName={getClassName}
        />
        {recaptchaRequired && (
          <div className="form-group">
            <div className={getClassName('kcInputWrapperClass')}>
              <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} />
            </div>
          </div>
        )}
        <div className={getClassName('kcFormGroupClass')} style={{ marginBottom: 30 }}>
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
              value={msgStr('doRegister')}
              disabled={!isFormSubmittable}
            />
          </div>
        </div>
      </form>
    </Template>
  );
}
