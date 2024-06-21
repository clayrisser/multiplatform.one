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
import { Input, YStack, Label, Button, Anchor, Text, FieldInput } from 'ui';
import React from 'react';
import { GestureResponderEvent } from 'react-native';
import { useForm } from '@tanstack/react-form';

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
  const form = useForm({
    defaultValues: register.formData,
    onSubmit: async ({ value }) => {
      // action('onSubmit')(value);
      console.log(value);
    },
  });

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
        <YStack>
          <FieldInput form={form} label={msg('firstName') as unknown as string} name="firstName" />
          <FieldInput form={form} label={msg('lastName') as unknown as string} value={registerForm.lastName} />
          <FieldInput label={msg('email') as unknown as string} name="email" form={form} />
          {!realm.registrationEmailAsUsername && (
            <FieldInput label={msg('username') as unknown as string} name="username" form={form} />
          )}
          {passwordRequired && (
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
              <FieldInput
                label={msg('passwordConfirm') as unknown as string}
                name="passwordConfirm"
                form={form}
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
          <YStack id="kc-form-options" ai="flex-start" marginVertical="$4">
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
