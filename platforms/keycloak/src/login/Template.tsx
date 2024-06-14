/**
 * File: /src/login/Template.tsx
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

import keycloakifyLogoPngUrl from './assets/keycloakify-logo.png';
import type { I18n } from './i18n';
import type { KcContext } from './kcContext';
import type { TemplateProps } from 'keycloakify/login/TemplateProps';
import { PUBLIC_URL } from 'keycloakify/PUBLIC_URL';
import { assert } from 'keycloakify/tools/assert';
import { clsx } from 'keycloakify/tools/clsx';
import { useGetClassName } from 'keycloakify/login/lib/useGetClassName';
import { usePrepareTemplate } from 'keycloakify/lib/usePrepareTemplate';
import { useState } from 'react';

export default function Template({
  displayInfo = false,
  displayMessage = true,
  displayRequiredFields = false,
  displayWide = false,
  showAnotherWayIfPresent = true,
  headerNode,
  showUsernameNode = null,
  infoNode = null,
  kcContext,
  i18n,
  doUseDefaultCss,
  classes,
  children,
}: TemplateProps<KcContext, I18n>) {
  const { getClassName } = useGetClassName({ doUseDefaultCss, classes });
  const { msg, changeLocale, labelBySupportedLanguageTag, currentLanguageTag } = i18n;
  const { realm, locale, auth, url, message, isAppInitiatedAction } = kcContext;
  const { isReady } = usePrepareTemplate({
    doFetchDefaultThemeResources: doUseDefaultCss,
    styles: [
      `${url.resourcesCommonPath}/lib/zocial/zocial.css`,
      `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly-additions.min.css`,
      `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly.min.css`,
      `${url.resourcesPath}/css/login.css`,
    ],
    htmlClassName: getClassName('kcHtmlClass'),
    bodyClassName: getClassName('kcBodyClass'),
  });
  useState(() => {
    document.title = i18n.msgStr('loginTitle', kcContext.realm.displayName);
  });
  if (!isReady) return null;
  return (
    <div className={getClassName('kcLoginClass')}>
      <div id="kc-header" className={getClassName('kcHeaderClass')}>
        <div
          id="kc-header-wrapper"
          className={getClassName('kcHeaderWrapperClass')}
          style={{ fontFamily: '"Work Sans"' }}
        >
          <img src={`${PUBLIC_URL}/keycloakify-logo.png`} alt="Keycloakify logo" width={50} />
          {msg('loginTitleHtml', realm.displayNameHtml)}!!!
          <img src={keycloakifyLogoPngUrl} alt="Keycloakify logo" width={50} />
        </div>
      </div>
      <div className={clsx(getClassName('kcFormCardClass'), displayWide && getClassName('kcFormCardAccountClass'))}>
        <header className={getClassName('kcFormHeaderClass')}>
          {realm.internationalizationEnabled && (assert(locale !== undefined), true) && locale.supported.length > 1 && (
            <div id="kc-locale">
              <div id="kc-locale-wrapper" className={getClassName('kcLocaleWrapperClass')}>
                <div className="kc-dropdown" id="kc-locale-dropdown">
                  <a href="#" id="kc-current-locale-link">
                    {labelBySupportedLanguageTag[currentLanguageTag]}
                  </a>
                  <ul>
                    {locale.supported.map(({ languageTag }) => (
                      <li key={languageTag} className="kc-dropdown-item">
                        <a href="#" onClick={() => changeLocale(languageTag)}>
                          {labelBySupportedLanguageTag[languageTag]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          {!(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
            displayRequiredFields ? (
              <div className={getClassName('kcContentWrapperClass')}>
                <div className={clsx(getClassName('kcLabelWrapperClass'), 'subtitle')}>
                  <span className="subtitle">
                    <span className="required">*</span>
                    {msg('requiredFields')}
                  </span>
                </div>
                <div className="col-md-10">
                  <h1 id="kc-page-title">{headerNode}</h1>
                </div>
              </div>
            ) : (
              <h1 id="kc-page-title">{headerNode}</h1>
            )
          ) : displayRequiredFields ? (
            <div className={getClassName('kcContentWrapperClass')}>
              <div className={clsx(getClassName('kcLabelWrapperClass'), 'subtitle')}>
                <span className="subtitle">
                  <span className="required">*</span> {msg('requiredFields')}
                </span>
              </div>
              <div className="col-md-10">
                {showUsernameNode}
                <div className={getClassName('kcFormGroupClass')}>
                  <div id="kc-username">
                    <label id="kc-attempted-username">{auth?.attemptedUsername}</label>
                    <a id="reset-login" href={url.loginRestartFlowUrl}>
                      <div className="kc-login-tooltip">
                        <i className={getClassName('kcResetFlowIcon')} />
                        <span className="kc-tooltip-text">{msg('restartLoginTooltip')}</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {showUsernameNode}
              <div className={getClassName('kcFormGroupClass')}>
                <div id="kc-username">
                  <label id="kc-attempted-username">{auth?.attemptedUsername}</label>
                  <a id="reset-login" href={url.loginRestartFlowUrl}>
                    <div className="kc-login-tooltip">
                      <i className={getClassName('kcResetFlowIcon')} />
                      <span className="kc-tooltip-text">{msg('restartLoginTooltip')}</span>
                    </div>
                  </a>
                </div>
              </div>
            </>
          )}
        </header>
        <div id="kc-content">
          <div id="kc-content-wrapper">
            {displayMessage && message !== undefined && (message.type !== 'warning' || !isAppInitiatedAction) && (
              <div className={clsx('alert', `alert-${message.type}`)}>
                {message.type === 'success' && <span className={getClassName('kcFeedbackSuccessIcon')} />}
                {message.type === 'warning' && <span className={getClassName('kcFeedbackWarningIcon')} />}
                {message.type === 'error' && <span className={getClassName('kcFeedbackErrorIcon')} />}
                {message.type === 'info' && <span className={getClassName('kcFeedbackInfoIcon')} />}
                <span
                  className="kc-feedback-text"
                  dangerouslySetInnerHTML={{
                    __html: message.summary,
                  }}
                />
              </div>
            )}
            {children}
            {auth !== undefined && auth.showTryAnotherWayLink && showAnotherWayIfPresent && (
              <form
                id="kc-select-try-another-way-form"
                action={url.loginAction}
                method="post"
                className={clsx(displayWide && getClassName('kcContentWrapperClass'))}
              >
                <div
                  className={clsx(
                    displayWide && [
                      getClassName('kcFormSocialAccountContentClass'),
                      getClassName('kcFormSocialAccountClass'),
                    ],
                  )}
                >
                  <div className={getClassName('kcFormGroupClass')}>
                    <input type="hidden" name="tryAnotherWay" value="on" />
                    <a
                      href="#"
                      id="try-another-way"
                      onClick={() => {
                        document.forms['kc-select-try-another-way-form' as never].submit();
                        return false;
                      }}
                    >
                      {msg('doTryAnotherWay')}
                    </a>
                  </div>
                </div>
              </form>
            )}
            {displayInfo && (
              <div id="kc-info" className={getClassName('kcSignUpClass')}>
                <div id="kc-info-wrapper" className={getClassName('kcInfoAreaWrapperClass')}>
                  {infoNode}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
