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

import type { I18n } from './i18n';
import type { KcContext } from './kcContext';
import type { TemplateProps } from 'keycloakify/login/TemplateProps';
import { Share, Info } from '@tamagui/lucide-icons';
import { YStack, Card, XStack, Text, Anchor, Label, Input, H5, SimplePopover, Button, H1 } from 'ui';
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
  const { msg } = i18n;
  const { realm, auth, url, message, isAppInitiatedAction } = kcContext;
  const { isReady } = usePrepareTemplate({
    doFetchDefaultThemeResources: doUseDefaultCss,
    styles: [
      `${url.resourcesCommonPath}/lib/zocial/zocial.css`,
      `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly-additions.min.css`,
      `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly.min.css`,
      `${url.resourcesPath}/css/login.css`,
    ],
    bodyClassName: undefined, // getClassName('kcBodyClass'),
    htmlClassName: undefined, // getClassName('kcHtmlClass'),
  });
  useState(() => {
    document.title = i18n.msgStr('loginTitle', kcContext.realm.displayName);
  });
  if (!isReady) return null;
  return (
    <>
      <XStack fullscreen backgroundColor="$background" />
      <YStack position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
        <H1 marginVertical="$6" textTransform="capitalize" letterSpacing={0.5} textAlign="center">
          {msg('loginTitleHtml', realm.displayNameHtml)}!!!
        </H1>
        <Card width={450} elevation="$4">
          <Card.Background>{/* <Image src={keycloakifyLogoPngUrl} alt="Keycloakify logo" /> */}</Card.Background>
          <Card.Header>
            <YStack>
              {!(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                displayRequiredFields ? (
                  <XStack>
                    <XStack>
                      <Text className="required">*</Text>
                      {msg('requiredFields')}
                    </XStack>

                    <Text id="kc-page-title">{headerNode}</Text>
                  </XStack>
                ) : (
                  <H5 fontSize={24} textAlign="center" id="kc-page-title">
                    {headerNode}
                  </H5>
                )
              ) : displayRequiredFields ? (
                <YStack>
                  <YStack>
                    <Text>*</Text> {msg('requiredFields')}
                  </YStack>
                  <YStack>
                    {showUsernameNode}
                    <YStack>
                      <YStack id="kc-username">
                        <Label id="kc-attempted-username">{auth?.attemptedUsername}</Label>
                        <Anchor id="reset-login" href={url.loginRestartFlowUrl}>
                          <Share />
                          <Text>{msg('restartLoginTooltip')}</Text>
                        </Anchor>
                      </YStack>
                    </YStack>
                  </YStack>
                </YStack>
              ) : (
                <YStack>
                  {showUsernameNode}
                  <YStack>
                    <XStack als="center" id="kc-username">
                      <Label id="kc-attempted-username">{auth?.attemptedUsername}</Label>
                      <Anchor als="center" id="reset-login" href={url.loginRestartFlowUrl}>
                        <XStack ai="center" gap="$2" className="kc-login-tooltip">
                          <SimplePopover hoverable trigger={<Button unstyled iconAfter={<Share size={20} />} />}>
                            {msg('restartLoginTooltip')}
                          </SimplePopover>
                        </XStack>
                      </Anchor>
                    </XStack>
                  </YStack>
                </YStack>
              )}
            </YStack>
          </Card.Header>
          <YStack>
            <YStack width="100%" padding="$4" id="kc-content">
              <YStack id="kc-content-wrapper">
                {displayMessage && message !== undefined && (message.type !== 'warning' || !isAppInitiatedAction) && (
                  <XStack ai="center" gap="$1" bg="$backgroundFocus" borderRadius="$4" padding="$4">
                    <Info size={18} />
                    {message.type === 'success' && <Text />}
                    {message.type === 'warning' && <Text />}
                    {message.type === 'error' && <Text />}
                    {message.type === 'info' && <Text />}
                    <Text
                      dangerouslySetInnerHTML={{
                        __html: message.summary,
                      }}
                    />
                  </XStack>
                )}
                {children}
                {auth !== undefined && auth.showTryAnotherWayLink && showAnotherWayIfPresent && (
                  <form
                    id="kc-select-try-another-way-form"
                    action={url.loginAction}
                    method="post"
                    className={clsx(displayWide && getClassName('kcContentWrapperClass'))}
                  >
                    <YStack>
                      <YStack>
                        <Input
                          // @ts-ignore
                          type="hidden"
                          name="tryAnotherWay"
                          value="on"
                        />
                        <Anchor
                          href="#"
                          id="try-another-way"
                          // @ts-ignore
                          onClick={() => {
                            document.forms['kc-select-try-another-way-form' as never].submit();
                            return false;
                          }}
                        >
                          {msg('doTryAnotherWay')}
                        </Anchor>
                      </YStack>
                    </YStack>
                  </form>
                )}
                {displayInfo && (
                  <YStack id="kc-info">
                    <YStack id="kc-info-wrapper">{infoNode}</YStack>
                  </YStack>
                )}
              </YStack>
            </YStack>
          </YStack>
        </Card>
      </YStack>
    </>
  );
}
