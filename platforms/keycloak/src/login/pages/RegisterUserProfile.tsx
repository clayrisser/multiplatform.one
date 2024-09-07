/**
 * File: /src/login/pages/RegisterUserProfile.tsx
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

import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { clsx } from "keycloakify/tools/clsx";
import { useState } from "react";
import { Anchor, Button, Text, Theme, YStack } from "ui";
import type { I18n } from "../i18n";
import type { KcContext } from "../kcContext";
import { UserProfileFormFields } from "./shared/UserProfileFormFields";

export default function RegisterUserProfile({
  kcContext,
  i18n,
  doUseDefaultCss,
  Template,
  classes,
}: PageProps<
  Extract<KcContext, { pageId: "register-user-profile.ftl" }>,
  I18n
>) {
  const { getClassName } = useGetClassName({
    doUseDefaultCss,
    classes,
  });

  const { url, messagesPerField, recaptchaRequired, recaptchaSiteKey } =
    kcContext;
  const { msg, msgStr } = i18n;
  const [isFormSubmittable, setIsFormSubmittable] = useState(false);

  return (
    <Theme>
      <Template
        {...{ kcContext, i18n, doUseDefaultCss, classes }}
        displayMessage={messagesPerField.exists("global")}
        displayRequiredFields={true}
        headerNode={msg("registerTitle")}
      >
        <YStack
          id="kc-register-form"
          // @ts-ignore
          action={url.registrationAction}
          method="post"
        >
          <UserProfileFormFields
            kcContext={kcContext}
            onIsFormSubmittableValueChange={setIsFormSubmittable}
            i18n={i18n}
            getClassName={getClassName}
          />
          {recaptchaRequired && (
            <YStack>
              <YStack>
                <YStack data-sitekey={recaptchaSiteKey} />
              </YStack>
            </YStack>
          )}
          <YStack>
            <YStack
              id="kc-form-options"
              className={getClassName("kcFormOptionsClass")}
            >
              <YStack>
                <Text>
                  <Anchor color="$backgroundFocus" href={url.loginUrl}>
                    {msg("backToLogin")}
                  </Anchor>
                </Text>
              </YStack>
            </YStack>
            <YStack
              id="kc-form-buttons"
              className={getClassName("kcFormButtonsClass")}
            >
              <Button
                // @ts-ignore
                value={msgStr("doRegister")}
                disabled={!isFormSubmittable}
                cursor="pointer"
                bg="$backgroundFocus"
              >
                {msgStr("doRegister")}
              </Button>
            </YStack>
          </YStack>
        </YStack>
      </Template>
    </Theme>
  );
}
