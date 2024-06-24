/**
 * File: /src/login/pages/Login.tsx
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

import type { FormEventHandler } from 'react';
import type { I18n } from '../i18n';
import type { KcContext } from '../kcContext';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { Anchor, Button, Checkbox, FieldCheckbox, FieldInput, Label, Text, XStack, YStack } from 'ui';
import { Check } from '@tamagui/lucide-icons';
import { clsx } from 'keycloakify/tools/clsx';
import { useConstCallback } from 'keycloakify/tools/useConstCallback';
import { useForm } from '@tanstack/react-form';
import { Eye, EyeOff } from '@tamagui/lucide-icons';
import { useState } from 'react';

export default function Login({
  kcContext,
  i18n,
  doUseDefaultCss,
  Template,
  classes,
}: PageProps<Extract<KcContext, { pageId: 'login.ftl' }>, I18n>) {
  const { social, realm, url, usernameHidden, registrationDisabled } = kcContext;
  const { msg, msgStr } = i18n;
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
  const onSubmit = useConstCallback<FormEventHandler<HTMLFormElement>>((e) => {
    e.preventDefault();
    setIsLoginButtonDisabled(true);
    const formElement = e.target as HTMLFormElement;
    formElement.querySelector("input[name='email']")?.setAttribute('name', 'username');
    formElement.submit();
  });
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    defaultValues: {
      userName: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <Template
      {...{ kcContext, i18n, doUseDefaultCss, classes }}
      displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
      displayWide={realm.password && social.providers !== undefined}
      headerNode={msg('doLogIn')}
      infoNode={
        <XStack als="center" marginVertical="$5" id="kc-registration">
          <Text>
            {msg('noAccount')}
            {'  '}
            <Anchor fontSize={12} tabIndex={6} href={url.registrationUrl}>
              {msg('doRegister')}
            </Anchor>
          </Text>
        </XStack>
      }
    >
      <YStack id="kc-form" gap="$4" width="100%">
        <YStack id="kc-form-wrapper" width="100%">
          {realm.password && (
            <YStack>
              <form id="kc-form-login" onSubmit={onSubmit} action={url.loginAction} method="post">
                <YStack>
                  {!usernameHidden &&
                    (() => {
                      const label = !realm.loginWithEmailAllowed
                        ? 'username'
                        : realm.registrationEmailAsUsername
                          ? 'email'
                          : 'usernameOrEmail';
                      const autoCompleteHelper: typeof label = label === 'usernameOrEmail' ? 'username' : label;
                      return (
                        <YStack>
                          <FieldInput
                            form={form}
                            // @ts-ignore
                            name={autoCompleteHelper}
                            label={msg(label) as unknown as string}
                          />
                        </YStack>
                      );
                    })()}
                </YStack>
                <YStack>
                  <FieldInput
                    label={msg('password') as unknown as string}
                    name="password"
                    form={form}
                    inputProps={{
                      secureTextEntry: !showPassword,
                      autoFocus: true,
                    }}
                  />
                  <YStack ai="flex-end">
                    <Text
                      marginVertical="$2"
                      cursor="pointer"
                      onPress={() => setShowPassword(!showPassword)}
                      textAlign="right"
                    >
                      {showPassword ? 'hide' : 'show'}
                    </Text>
                  </YStack>
                </YStack>
                <XStack ai="center" jc="space-between">
                  <YStack id="kc-form-options">
                    {realm.rememberMe && !usernameHidden && (
                      <XStack jc="center" ai="center" gap="$2">
                        <FieldCheckbox
                          // checked={login.rememberMe === 'on'}
                          size="$4"
                        >
                          <Checkbox.Indicator>
                            <Check />
                          </Checkbox.Indicator>
                        </FieldCheckbox>
                        <Label>{msg('rememberMe')}</Label>
                      </XStack>
                    )}
                  </YStack>
                  <YStack>
                    {realm.resetPasswordAllowed && (
                      <Anchor tabIndex={5} href={url.loginResetCredentialsUrl}>
                        {msg('doForgotPassword')}
                      </Anchor>
                    )}
                  </YStack>
                </XStack>
                <YStack id="kc-form-buttons">
                  <Button bg="$backgroundFocus" disabled={isLoginButtonDisabled}>
                    {msgStr('doLogIn')}
                  </Button>
                </YStack>
              </form>
            </YStack>
          )}
        </YStack>
        {realm.password && social.providers !== undefined && (
          <YStack width="100%" gap="$4" id="kc-social-providers">
            {social.providers.map((p) => (
              <YStack key={p.providerId}>
                <Anchor
                  borderRadius="$2"
                  href={p.loginUrl}
                  id={`zocial-${p.alias}`}
                  className={clsx('zocial', p.providerId)}
                >
                  <Text marginHorizontal="$2">{p.displayName}</Text>
                </Anchor>
              </YStack>
            ))}
          </YStack>
        )}
      </YStack>
    </Template>
  );
}
