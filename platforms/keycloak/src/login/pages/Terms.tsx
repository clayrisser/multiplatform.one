/**
 * File: /src/login/pages/Terms.tsx
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

import tosEnUrl from '../assets/tosEn.md';
import type { I18n } from '../i18n';
import type { KcContext } from '../kcContext';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { Markdown } from 'keycloakify/tools/Markdown';
import { clsx } from 'keycloakify/tools/clsx';
import { evtTermMarkdown } from 'keycloakify/login/lib/useDownloadTerms';
import { useDownloadTerms } from 'keycloakify/login';
import { useGetClassName } from 'keycloakify/login/lib/useGetClassName';
import { useRerenderOnStateChange } from 'evt/hooks';
import { Button, XStack, YStack } from 'ui';

export default function Terms({
  Template,
  classes,
  doUseDefaultCss,
  i18n,
  kcContext,
}: PageProps<Extract<KcContext, { pageId: 'terms.ftl' }>, I18n>) {
  const { getClassName } = useGetClassName({
    classes,
    doUseDefaultCss,
  });
  const { msg, msgStr } = i18n;
  useDownloadTerms({
    kcContext,
    downloadTermMarkdown: async ({ currentLanguageTag }) => {
      const tosUrl = (() => {
        switch (currentLanguageTag) {
          default:
            return tosEnUrl;
        }
      })();
      if ('__STORYBOOK_ADDONS' in window) return tosUrl;
      const markdownString = await fetch(tosUrl).then((response) => response.text());
      return markdownString;
    },
  });
  useRerenderOnStateChange(evtTermMarkdown);
  const { url } = kcContext;
  const termMarkdown = evtTermMarkdown.state;
  if (termMarkdown === undefined) return;
  return (
    <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} displayMessage={false} headerNode={msg('termsTitle')}>
      <YStack id="kc-terms-text">
        <Markdown>{termMarkdown}</Markdown>
      </YStack>
      <form className="form-actions" action={url.loginAction} method="POST">
        <XStack gap="$2">
          <Button bg="$backgroundFocus" fontWeight="bold">
            {msgStr('doAccept')}
          </Button>
          <Button bg="$background" fontWeight="bold">
            {msgStr('doDecline')}
          </Button>
        </XStack>
      </form>
      <div className="clearfix" />
    </Template>
  );
}
