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
import { Input, YStack, Label, Button } from 'ui';
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
      <form
        ref={registerRef}
        id="kc-register-form"
        className={getClassName('kcFormClass')}
        action={url.registrationAction}
        method="post"
      >
        <YStack
          className={clsx(
            getClassName('kcFormGroupClass'),
            messagesPerField.printIfExists('firstName', getClassName('kcFormGroupErrorClass')),
          )}
        >
          <YStack className={getClassName('kcLabelWrapperClass')}>
            <Label htmlFor="firstName" className={getClassName('kcLabelClass')}>
              {msg('firstName')}
            </Label>
          </YStack>
          <YStack className={getClassName('kcInputWrapperClass')}>
            <Input
              value={registerForm.firstName}
              onChangeText={(value) => handleRegisterFormDateChange('firstName', value)}
            />
          </YStack>
        </YStack>
        <YStack
          className={clsx(
            getClassName('kcFormGroupClass'),
            messagesPerField.printIfExists('lastName', getClassName('kcFormGroupErrorClass')),
          )}
        >
          <YStack className={getClassName('kcLabelWrapperClass')}>
            <Label htmlFor="lastName" className={getClassName('kcLabelClass')}>
              {msg('lastName')}
            </Label>
          </YStack>
          <YStack className={getClassName('kcInputWrapperClass')}>
            <Input
              onChangeText={(value) => handleRegisterFormDateChange('lastName', value)}
              value={registerForm.lastName}
            />
          </YStack>
        </YStack>
        <YStack
          className={clsx(
            getClassName('kcFormGroupClass'),
            messagesPerField.printIfExists('email', getClassName('kcFormGroupErrorClass')),
          )}
        >
          <YStack className={getClassName('kcLabelWrapperClass')}>
            <Label htmlFor="email" className={getClassName('kcLabelClass')}>
              {msg('email')}
            </Label>
          </YStack>
          <YStack className={getClassName('kcInputWrapperClass')}>
            <Input
              autoComplete="email"
              onChangeText={(value) => handleRegisterFormDateChange('email', value)}
              value={registerForm.email}
            />
          </YStack>
        </YStack>
        {!realm.registrationEmailAsUsername && (
          <YStack
            className={clsx(
              getClassName('kcFormGroupClass'),
              messagesPerField.printIfExists('username', getClassName('kcFormGroupErrorClass')),
            )}
          >
            <YStack className={getClassName('kcLabelWrapperClass')}>
              <Label htmlFor="username" className={getClassName('kcLabelClass')}>
                {msg('username')}
              </Label>
            </YStack>
            <YStack className={getClassName('kcInputWrapperClass')}>
              <Input
                value={registerForm.username}
                onChangeText={(value) => handleRegisterFormDateChange('username', value)}
              />
            </YStack>
          </YStack>
        )}
        {passwordRequired && (
          <>
            <YStack
              className={clsx(
                getClassName('kcFormGroupClass'),
                messagesPerField.printIfExists('password', getClassName('kcFormGroupErrorClass')),
              )}
            >
              <YStack className={getClassName('kcLabelWrapperClass')}>
                <Label htmlFor="password" className={getClassName('kcLabelClass')}>
                  {msg('password')}
                </Label>
              </YStack>
              <YStack className={getClassName('kcInputWrapperClass')}>
                <Input
                  onChangeText={(value) => handleRegisterFormDateChange('password', value)}
                  value={registerForm.password}
                />
              </YStack>
            </YStack>
            <YStack
              className={clsx(
                getClassName('kcFormGroupClass'),
                messagesPerField.printIfExists('password-confirm', getClassName('kcFormGroupErrorClass')),
              )}
            >
              <YStack className={getClassName('kcLabelWrapperClass')}>
                <Label htmlFor="password-confirm" className={getClassName('kcLabelClass')}>
                  {msg('passwordConfirm')}
                </Label>
              </YStack>
              <YStack className={getClassName('kcInputWrapperClass')}>
                <Input
                  onChangeText={(value) => handleRegisterFormDateChange('passwordConfirm', value)}
                  value={registerForm.passwordConfirm}
                />
              </YStack>
            </YStack>
          </>
        )}
        {recaptchaRequired && (
          <YStack className="form-group">
            <YStack className={getClassName('kcInputWrapperClass')}>
              <YStack className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} />
            </YStack>
          </YStack>
        )}
        <YStack className={getClassName('kcFormGroupClass')}>
          <YStack id="kc-form-options" className={getClassName('kcFormOptionsClass')}>
            <YStack className={getClassName('kcFormOptionsWrapperClass')}>
              <span>
                <a href={url.loginUrl}>{msg('backToLogin')}</a>
              </span>
            </YStack>
          </YStack>
          <YStack id="kc-form-buttons" className={getClassName('kcFormButtonsClass')}>
            <Button
              onPress={handleRegister}
              // className={clsx(
              //   getClassName('kcButtonBlockClass'),
              //   getClassName('kcButtonClass'),
              //   getClassName('kcButtonLargeClass'),
              //   getClassName('kcButtonPrimaryClass'),
              // )}
            >
              {msg('doRegister')}
            </Button>
          </YStack>
        </YStack>
      </form>
    </Template>
  );
}
