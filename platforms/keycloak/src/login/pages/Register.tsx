import React from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { I18n } from '../i18n';
import type { KcContext } from '../kcContext';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { YStack, Anchor, Text, FieldInput, SubmitButton, Paragraph } from 'ui';
import { useForm } from '@tanstack/react-form';
import { Eye, EyeOff } from '@tamagui/lucide-icons';
import { useState, useRef, useCallback } from 'react';

export interface RegisterForm {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  'password-confirm'?: string;
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
  const [error, setError] = useState<RegisterForm>({});

  const form = useForm({
    defaultValues: {
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      email: registerForm.email,
      username: registerForm.username,
      password: '',
      'password-confirm': '',
    },
    onSubmit: async ({ value }) => {
      if (!validateForm(value)) return;
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

  function lookupField(field: string) {
    switch (field) {
      case 'firstName':
        return 'first name';
      case 'lastName':
        return 'last name';
      case 'email':
        return 'email';
      case 'username':
        return 'username';
      case 'password':
        return 'password';
      case 'password-confirm':
        return 'confirm password';
      default:
        return field;
    }
  }

  function validateForm(value: RegisterForm) {
    let flag = true;
    Object.entries(value).forEach(([name, value]) => {
      if (!value || value === '') {
        setError((prev) => ({ ...prev, [name]: `${lookupField(name)} is required` }));
        flag = false;
      }
    });
    return flag;
  }

  const handlePassword = useCallback(
    (e: GestureResponderEvent) => {
      e.preventDefault();
      setShowPassword(!showPassword);
    },
    [showPassword],
  );

  function handleChangeFirstName(value: string) {
    if (!value || value === '') {
      setError((prev) => ({ ...prev, firstName: 'first name is required' }));
    } else {
      setError((prev) => ({ ...prev, firstName: '' }));
    }
  }

  function handleChangeLastName(value: string) {
    if (!value || value === '') {
      setError((prev) => ({ ...prev, lastName: 'last name is required' }));
    } else {
      setError((prev) => ({ ...prev, lastName: '' }));
    }
  }

  function handleChangeEmail(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || value === '') {
      setError((prev) => ({ ...prev, email: 'email is required' }));
    } else if (!emailRegex.test(value)) {
      setError((prev) => ({ ...prev, email: 'invalid email format' }));
    } else {
      setError((prev) => ({ ...prev, email: '' }));
    }
  }

  function handleChangeUsername(value: string) {
    if (!value || value === '') {
      setError((prev) => ({ ...prev, username: 'username is required' }));
    } else {
      setError((prev) => ({ ...prev, username: '' }));
    }
  }

  function handleChangePassword(value: string) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/;
    if (!value || value === '') {
      setError((prev) => ({ ...prev, password: 'password is required' }));
    } else if (!passwordRegex.test(value)) {
      setError((prev) => ({
        ...prev,
        password:
          'Password must have min 6 and max 15 characters, one special character, one lowercase, one uppercase, and at least one number',
      }));
    } else {
      setError((prev) => ({ ...prev, password: '' }));
    }
  }

  function handleChangePasswordConfirm(value: string) {
    if (!value || value === '') {
      setError((prev) => ({ ...prev, 'password-confirm': 'confirm password is required' }));
    } else if (value !== form.state.values.password) {
      setError((prev) => ({ ...prev, 'password-confirm': 'passwords do not match' }));
    } else {
      setError((prev) => ({ ...prev, 'password-confirm': '' }));
    }
  }

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
            onChangeText={handleChangeFirstName}
          />
          {error.firstName && <Paragraph color="$red9">{error.firstName}</Paragraph>}
          <FieldInput
            form={form}
            id="lastName"
            label={msg('lastName')}
            name="lastName"
            tabIndex={2}
            inputProps={{
              autoComplete: 'off',
            }}
            onChangeText={handleChangeLastName}
          />
          {error.lastName && <Paragraph color="$red9">{error.lastName}</Paragraph>}
          <FieldInput
            form={form}
            id="email"
            label={msg('email')}
            name="email"
            tabIndex={3}
            inputProps={{
              autoComplete: 'off',
            }}
            onChangeText={handleChangeEmail}
          />
          {error.email && <Paragraph color="$red9">{error.email}</Paragraph>}
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
              onChangeText={handleChangeUsername}
            />
          )}
          {error.username && <Paragraph color="$red9">{error.username}</Paragraph>}
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
                onChangeText={handleChangePassword}
              />
              {error.password && (
                <Paragraph color={error.password === 'password is required' ? '$red9' : '$yellow9'}>
                  {error.password}
                </Paragraph>
              )}
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
              <YStack position="relative">
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
                  onChangeText={handleChangePasswordConfirm}
                />
                {error['password-confirm'] && <Paragraph color="$red9">{error['password-confirm']}</Paragraph>}
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
            <SubmitButton
              // disabled={disableRegisterButton}
              bg="$backgroundFocus"
              form={form}
              id="kc-register"
              tabIndex={6}
            >
              <Text fontSize={16}>{msg('doRegister')}</Text>
            </SubmitButton>
          </YStack>
        </YStack>
      </form>
    </Template>
  );
}
