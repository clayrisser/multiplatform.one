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

import React from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { I18n } from '../i18n';
import type { KcContext } from '../kcContext';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { YStack, Button, Anchor, Text, FieldInput, SubmitButton, FieldCheckbox } from 'ui';
import { useForm } from '@tanstack/react-form';
import { Eye, EyeOff } from '@tamagui/lucide-icons';
import { clsx } from 'keycloakify/tools/clsx';
import { useState, useRef, useCallback } from 'react';

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
  const { url, register, realm, passwordRequired, recaptchaRequired, recaptchaSiteKey } = kcContext;
  const { msg } = i18n;
  const [registerForm] = React.useState<RegisterForm>(register.formData);
  const [showPassword, setShowPassword] = React.useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const form = useForm({
    defaultValues: {
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      email: registerForm.email,
      username: registerForm.username,
      password: '',
      passwordConfirm: '',
    },
    onSubmit: async ({ value }) => {
      console.log('submit', value);
      Object.entries(value).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.name = name;
        input.value = value || '';
        input.type = 'hidden';
        input.style.display = 'none';
        formRef.current?.appendChild(input);
      });
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
    <Template {...{ kcContext, i18n, doUseDefaultCss, classes }} headerNode={msg('registerTitle')}>
      <form ref={formRef} id="kc-register-form" action={url.registrationAction} method="post">
        <YStack>
          <FieldInput
            form={form}
            id="firstName"
            label={msg('firstName')}
            name="firstName"
            tabIndex={1}
            inputProps={{
              autoComplete: 'off',
              autoFocus: true,
            }}
          />
          <FieldInput
            form={form}
            id="lastName"
            label={msg('lastName')}
            name="lastName"
            tabIndex={2}
            inputProps={{
              autoComplete: 'off',
            }}
          />
          <FieldInput
            form={form}
            id="email"
            label={msg('email')}
            name="email"
            tabIndex={3}
            inputProps={{
              autoComplete: 'off',
            }}
          />
          {!realm.registrationEmailAsUsername && (
            <FieldInput
              form={form}
              id="username"
              label={msg('username')}
              name="username"
              tabIndex={4}
              inputProps={{
                autoComplete: 'off',
              }}
            />
          )}
          {passwordRequired && (
            <YStack>
              <FieldInput
                form={form}
                id="password"
                label={msg('password')}
                name="password"
                tabIndex={4}
                inputProps={{
                  autoComplete: 'off',
                  secureTextEntry: !showPassword,
                }}
              />
              <YStack
                als="flex-end"
                backgroundColor="transparent"
                borderWidth={0}
                top={36}
                cursor="pointer"
                onPress={handlePassword}
                padding="$2.5"
                position="absolute"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size="$1.5" /> : <Eye size="$1.5" />}
              </YStack>
              <FieldInput
                form={form}
                id="password-confirm"
                label={msg('passwordConfirm')}
                // @ts-ignore
                name="password-confirm"
                tabIndex={5}
                inputProps={{
                  autoComplete: 'off',
                  secureTextEntry: !showPassword,
                }}
              />
              <YStack
                als="flex-end"
                backgroundColor="transparent"
                borderWidth={0}
                top={116}
                cursor="pointer"
                onPress={handlePassword}
                padding="$2.5"
                position="absolute"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size="$1.5" /> : <Eye size="$1.5" />}
              </YStack>
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
          <YStack id="kc-form-options" ai="flex-start" marginVertical="$4">
            <Text>
              <Anchor href={url.loginUrl}>{msg('backToLogin')}</Anchor>
            </Text>
          </YStack>
          <YStack id="kc-form-buttons">
            <SubmitButton bg="$backgroundFocus" form={form} id="kc-register" tabIndex={6}>
              <Text fontSize={16}>{msg('doRegister')}</Text>
            </SubmitButton>
          </YStack>
        </YStack>
      </form>
    </Template>
  );
}
