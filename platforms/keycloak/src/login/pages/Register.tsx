/**
 * File: /src/login/pages/Register.tsx
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

import type { I18n } from '../i18n';
import type { KcContext } from '../kcContext';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { clsx } from 'keycloakify/tools/clsx';
import { useGetClassName } from 'keycloakify/login/lib/useGetClassName';
import { Input, YStack, Label, Button, Anchor, Text, FormInput } from 'ui';
import React from 'react';
import { GestureResponderEvent } from 'react-native';

export interface RegisterForm {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  passwordConfirm?: string;
}
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
  const [registerForm, setRegisterForm] = React.useState<RegisterForm>(register.formData);
  const registerRef = React.useRef<HTMLFormElement | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  function handleRegisterFormDateChange(key: string, value: string) {
    setRegisterForm({
      ...registerForm,
      [key]: value,
    });
  }

  function handleRegister(e: GestureResponderEvent) {
    e.preventDefault();
    if (!registerRef.current || !registerRef.current.onSubmit) return;
    registerRef.current.onSubmit(registerForm);
  }

  return (
    <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} headerNode={msg('registerTitle')}>
      <form ref={registerRef} id="kc-register-form" action={url.registrationAction} method="post">
        {/* <YStack>
          <YStack>
            <Label htmlFor="firstName">{msg('firstName')}*</Label>
          </YStack>
          <YStack>
            <Input
              value={registerForm.firstName}
              onChangeText={(value) => handleRegisterFormDateChange('firstName', value)}
            />
          </YStack>
        </YStack>
        <YStack>
          <YStack>
            <Label htmlFor="lastName">{msg('lastName')}*</Label>
          </YStack>
          <YStack>
            <Input
              onChangeText={(value) => handleRegisterFormDateChange('lastName', value)}
              value={registerForm.lastName}
            />
          </YStack>
        </YStack>
        <YStack>
          <YStack>
            <Label htmlFor="email">{msg('email')}*</Label>
          </YStack>
          <YStack>
            <Input
              autoComplete="email"
              onChangeText={(value) => handleRegisterFormDateChange('email', value)}
              value={registerForm.email}
            />
          </YStack>
        </YStack>
        {!realm.registrationEmailAsUsername && (
          <YStack>
            <YStack>
              <Label htmlFor="username">{msg('username')}*</Label>
            </YStack>
            <YStack>
              <Input
                value={registerForm.username}
                onChangeText={(value) => handleRegisterFormDateChange('username', value)}
              />
            </YStack>
          </YStack>
        )}
        {passwordRequired && (
          <YStack>
            <YStack>
              <YStack>
                <Label htmlFor="password">{msg('password')}*</Label>
              </YStack>
              <YStack>
                <Input
                  secureTextEntry={!showPassword}
                  onChangeText={(value) => handleRegisterFormDateChange('password', value)}
                  value={registerForm.password}
                />
              </YStack>
            </YStack>
            <YStack>
              <YStack>
                <Label htmlFor="password-confirm">{msg('passwordConfirm')}*</Label>
              </YStack>
              <YStack>
                <Input
                  secureTextEntry={!showPassword}
                  onChangeText={(value) => handleRegisterFormDateChange('passwordConfirm', value)}
                  value={registerForm.passwordConfirm}
                />
              </YStack>
            </YStack>
            <YStack>
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
        )} */}
        <YStack>
          <FormInput
            label={msg('firstName') as unknown as string}
            value={registerForm.firstName}
            onChangeText={(value) => handleRegisterFormDateChange('firstName', value)}
          />
          <FormInput
            label={msg('lastName') as unknown as string}
            onChangeText={(value) => handleRegisterFormDateChange('lastName', value)}
            value={registerForm.lastName}
          />{' '}
          <FormInput
            label={msg('email') as unknown as string}
            onChangeText={(value) => handleRegisterFormDateChange('email', value)}
            value={registerForm.email}
          />{' '}
          {!realm.registrationEmailAsUsername && (
            <FormInput
              label={msg('username') as unknown as string}
              value={registerForm.username}
              onChangeText={(value) => handleRegisterFormDateChange('username', value)}
            />
          )}
          {passwordRequired && (
            <YStack>
              {' '}
              <FormInput
                label={msg('password') as unknown as string}
                onChangeText={(value) => handleRegisterFormDateChange('password', value)}
                value={registerForm.password}
                inputProps={{
                  secureTextEntry: !showPassword,
                  autoFocus: true,
                }}
              />{' '}
              <FormInput
                label={msg('passwordConfirm') as unknown as string}
                onChangeText={(value) => handleRegisterFormDateChange('passwordConfirm', value)}
                value={registerForm.passwordConfirm}
                inputProps={{
                  secureTextEntry: !showPassword,
                  autoFocus: true,
                }}
              />
              <Text
                marginVertical="$2"
                cursor="pointer"
                onPress={() => setShowPassword(!showPassword)}
                textAlign="right"
              >
                {showPassword ? 'hide' : 'show'}
              </Text>
            </YStack>
          )}
        </YStack>
        {recaptchaRequired && (
          <YStack>
            <YStack>
              <YStack className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} />
            </YStack>
          </YStack>
        )}
        <YStack>
          <YStack id="kc-form-options" marginVertical="$4">
            <Text>
              <Anchor href={url.loginUrl}>{msg('backToLogin')}</Anchor>
            </Text>
          </YStack>
          <YStack id="kc-form-buttons">
            <Button onPress={handleRegister} bg="$backgroundFocus">
              {msg('doRegister')}
            </Button>
          </YStack>
        </YStack>
      </form>
    </Template>
  );
}
