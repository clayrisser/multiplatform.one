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

import type { GestureResponderEvent } from 'react-native';
import type { I18n } from '../i18n';
import type { KcContext } from '../kcContext';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { Anchor, SubmitButton, FieldCheckbox, FieldInput, Text, XStack, YStack, Paragraph } from 'ui';
import { Eye, EyeOff } from '@tamagui/lucide-icons';
import { clsx } from 'keycloakify/tools/clsx';
import { useForm } from '@tanstack/react-form';
import { useState, useRef, useCallback } from 'react';

export default function Login({
  kcContext,
  i18n,
  doUseDefaultCss,
  Template,
  classes,
}: PageProps<Extract<KcContext, { pageId: 'login.ftl' }>, I18n>) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { social, realm, url, usernameHidden, registrationDisabled, login, auth } = kcContext;
  const { msg, msgStr } = i18n;
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<{ [key: string]: boolean }>({});
  const [userInput, setUserInput] = useState('');
  const form = useForm({
    defaultValues: {
      email: '',
      credentialId: auth.selectedCredential,
      password: '',
      rememberMe: realm.rememberMe && !usernameHidden ? login.rememberMe === 'on' : undefined,
      username: login.username ?? '',
      usernameOrEmail: '',
    },
    onSubmit: ({ value }) => {
      let hasError = false;
      const newErrorState: { [key: string]: boolean } = {};

      if (!value.username) {
        newErrorState.username = true;
        hasError = true;
        setLoginError(newErrorState);
        return;
      } else {
        newErrorState.username = false;
        hasError = false;
        setLoginError(newErrorState);
      }
      if (!value.password) {
        newErrorState.password = true;
        hasError = true;
        setLoginError(newErrorState);
        return;
      } else {
        newErrorState.password = false;
        hasError = false;
        setLoginError(newErrorState);
      }

      // setLoginError(newErrorState);

      if (hasError) {
        return;
      }

      setIsLoginButtonDisabled(true);
      Object.entries(value).forEach(([name, value]) => {
        if (!value) return;
        if (name === 'email' || name === 'usernameOrEmail') name = 'username';
        if (name === 'username' && formRef.current?.querySelector('input[name="username"]')) return;
        const input = document.createElement('input');
        input.name = name;
        input.value = value === true ? 'on' : value;
        input.type = 'hidden';
        input.style.display = 'none';
        formRef.current?.appendChild(input);
      });
      if (!formRef.current?.querySelector('input[name="credentialId"]')) {
        const input = document.createElement('input');
        input.name = 'credentialId';
        input.value = '';
        input.type = 'hidden';
        input.style.display = 'none';
        formRef.current?.appendChild(input);
      }

      formRef.current?.submit();
    },
  });

  const handlePassword = useCallback(
    (e: GestureResponderEvent) => {
      e.preventDefault();
      setShowPassword(!showPassword);
    },
    [showPassword],
  );
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
              <form action={url.loginAction} id="kc-form-login" method="post" ref={formRef}>
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
                            id={autoCompleteHelper}
                            label={msg(label)}
                            name={autoCompleteHelper}
                            tabIndex={1}
                            inputProps={{
                              autoComplete: 'off',
                              autoFocus: true,
                            }}
                            required
                          />
                          {loginError.username && <Paragraph color="$red9">Email/Username is Required</Paragraph>}
                        </YStack>
                      );
                    })()}
                </YStack>
                <YStack position="relative">
                  <FieldInput
                    form={form}
                    id="password"
                    label={msg('password')}
                    name="password"
                    tabIndex={2}
                    inputProps={{
                      autoComplete: 'off',
                      secureTextEntry: !showPassword,
                    }}
                    required
                  />
                  {loginError.password && <Paragraph color="$red9">Password is Required</Paragraph>}
                  <YStack
                    als="flex-end"
                    backgroundColor="transparent"
                    borderWidth={0}
                    bottom={loginError.password ? 24 : 0}
                    cursor="pointer"
                    onPress={handlePassword}
                    padding="$2.5"
                    position="absolute"
                    tabIndex={-1}
                    paddingLeft={4}
                  >
                    {showPassword ? <EyeOff size="$1.5" /> : <Eye size="$1.5" />}
                  </YStack>
                </YStack>
                <XStack ai="center" jc="space-between">
                  <YStack id="kc-form-options">
                    {/* {realm.rememberMe && !usernameHidden && ( */}
                    <XStack jc="center" ai="center" gap="$2">
                      <FieldCheckbox
                        form={form}
                        id="rememberMe"
                        label={msg('rememberMe')}
                        name="rememberMe"
                        tabIndex={3}
                      />
                    </XStack>
                    {/* )} */}
                  </YStack>
                  <YStack>
                    {/* {realm.resetPasswordAllowed && ( */}
                    <Anchor tabIndex={5} href={url.loginResetCredentialsUrl}>
                      {msg('doForgotPassword')}
                    </Anchor>
                    {/* )} */}
                  </YStack>
                </XStack>
                <YStack id="kc-form-buttons">
                  <SubmitButton
                    bg="$backgroundFocus"
                    disabled={isLoginButtonDisabled}
                    form={form}
                    id="kc-login"
                    tabIndex={4}
                  >
                    {msgStr('doLogIn')}
                  </SubmitButton>
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
