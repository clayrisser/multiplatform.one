/**
 * File: /src/keycloak-theme/login/pages/Terms.tsx
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
import { Markdown } from 'keycloakify/tools/Markdown';
import { clsx } from 'keycloakify/tools/clsx';
import { evtTermMarkdown } from 'keycloakify/login/lib/useDownloadTerms';
import { useDownloadTerms } from 'keycloakify/login';
import { useGetClassName } from 'keycloakify/login/lib/useGetClassName';
import { useRerenderOnStateChange } from 'evt/hooks';

export default function Terms(props: PageProps<Extract<KcContext, { pageId: 'terms.ftl' }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { getClassName } = useGetClassName({
    doUseDefaultCss,
    classes,
  });
  const { msg, msgStr } = i18n;
  useDownloadTerms({
    kcContext,
    downloadTermMarkdown: async ({ currentLanguageTag }) => {
      const tos_url = (() => {
        switch (currentLanguageTag) {
          case 'fr':
            return `${import.meta.env.BASE_URL}terms/fr.md`;
          default:
            return `${import.meta.env.BASE_URL}terms/en.md`;
        }
      })();
      const markdownString = await fetch(tos_url).then((response) => response.text());
      return markdownString;
    },
  });
  useRerenderOnStateChange(evtTermMarkdown);
  const { url } = kcContext;
  const termMarkdown = evtTermMarkdown.state;
  if (termMarkdown === undefined) return null;

  return (
    <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} displayMessage={false} headerNode={msg('termsTitle')}>
      <div id="kc-terms-text">
        <Markdown>{termMarkdown}</Markdown>
      </div>
      <form className="form-actions" action={url.loginAction} method="POST">
        <input
          className={clsx(
            getClassName('kcButtonClass'),
            getClassName('kcButtonClass'),
            getClassName('kcButtonClass'),
            getClassName('kcButtonPrimaryClass'),
            getClassName('kcButtonLargeClass'),
          )}
          name="accept"
          id="kc-accept"
          type="submit"
          value={msgStr('doAccept')}
        />
        <input
          className={clsx(
            getClassName('kcButtonClass'),
            getClassName('kcButtonDefaultClass'),
            getClassName('kcButtonLargeClass'),
          )}
          name="cancel"
          id="kc-decline"
          type="submit"
          value={msgStr('doDecline')}
        />
      </form>
      <div className="clearfix" />
    </Template>
  );
}
