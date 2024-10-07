/**
 * File: /src/login/pages/Register.tsx
 * Project: @platform/keycloak
 * File Created: 11-09-2024 14:21:33
 * Author: Clay Risser
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

import { Eye, EyeOff } from "@tamagui/lucide-icons";
import { useForm } from "@tanstack/react-form";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useCallback, useRef, useState } from "react";
import type { GestureResponderEvent } from "react-native";
import { Anchor, FieldInput, Paragraph, SubmitButton, Text, YStack } from "ui";
import type { I18n } from "../i18n";
import type { KcContext } from "../kcContext";

export interface RegisterForm {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  "password-confirm"?: string;
}

export default function Register({
  kcContext,
  i18n,
  doUseDefaultCss,
  Template,
  classes,
}: PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n>) {
  const {
    url,
    register,
    realm,
    passwordRequired,
    recaptchaRequired,
    recaptchaSiteKey,
  } = kcContext;
  const { msg } = i18n;
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [error, setError] = useState<RegisterForm>({});

  const mainFields = [
    "firstName",
    "lastName",
    "email",
    "username",
    "password",
    "password-confirm",
  ];
  // @ts-ignore
  const extraFields = Object.keys(register?.attributesByName || {}).filter(
    (field) => !mainFields.includes(field),
  );

  const form = useForm({
    defaultValues: {
      firstName: register.formData.firstName || "",
      lastName: register.formData.lastName || "",
      email: register.formData.email || "",
      username: register.formData.username || "",
      ...Object.fromEntries(extraFields.map((field) => [field, ""])),
      password: "",
      "password-confirm": "",
    },

    onSubmit: async ({ value }) => {
      if (!validateForm(value)) return;
      Object.entries(value).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.name = name;
        input.value = value.trim() || "";
        input.type = "hidden";
        input.style.display = "none";
        formRef.current?.appendChild(input);
      });
      formRef.current?.submit();
    },
  });

  function lookupField(field: string) {
    switch (field) {
      case "firstName":
        return "first name";
      case "lastName":
        return "last name";
      case "password-confirm":
        return "confirm password";
      default:
        return field;
    }
  }

  function validateForm(value: RegisterForm) {
    let flag = true;
    Object.entries(value).forEach(([name, value]) => {
      if (typeof value === "string")
        if (!value || value.trim() === "") {
          setError((prev) => ({
            ...prev,
            [name]: `${lookupField(name)} is required`,
          }));
          flag = false;
        }
    });
    console.log("value", value);
    console.log("error", error);
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
    if (!value || value === "") {
      setError((prev) => ({ ...prev, firstName: "first name is required" }));
    } else {
      setError((prev) => ({ ...prev, firstName: "" }));
    }
  }

  function handleChangeLastName(value: string) {
    if (!value || value === "") {
      setError((prev) => ({ ...prev, lastName: "last name is required" }));
    } else {
      setError((prev) => ({ ...prev, lastName: "" }));
    }
  }

  function handleChangeEmail(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || value === "") {
      setError((prev) => ({ ...prev, email: "email is required" }));
    } else if (!emailRegex.test(value)) {
      setError((prev) => ({ ...prev, email: "invalid email format" }));
    } else {
      setError((prev) => ({ ...prev, email: "" }));
    }
  }

  function handleChangeUsername(value: string) {
    if (!value || value === "") {
      setError((prev) => ({ ...prev, username: "username is required" }));
    } else {
      setError((prev) => ({ ...prev, username: "" }));
    }
  }

  function handleChangePassword(value: string) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/;
    if (!value || value === "") {
      setError((prev) => ({ ...prev, password: "password is required" }));
    } else if (!passwordRegex.test(value)) {
      setError((prev) => ({
        ...prev,
        password:
          "Password must have min 6 and max 15 characters, one special character, one lowercase, one uppercase, and at least one number",
      }));
    } else {
      setError((prev) => ({ ...prev, password: "" }));
    }
  }

  function handleChangePasswordConfirm(value: string) {
    if (!value || value === "") {
      setError((prev) => ({
        ...prev,
        "password-confirm": "confirm password is required",
      }));
    } else if (value !== form.state.values.password) {
      setError((prev) => ({
        ...prev,
        "password-confirm": "passwords do not match",
      }));
    } else {
      setError((prev) => ({ ...prev, "password-confirm": "" }));
    }
  }
  console.log("register component");

  return (
    <Template
      {...{ kcContext, i18n, doUseDefaultCss, classes }}
      headerNode={msg("registerTitle")}
    >
      <form
        ref={formRef}
        id="kc-register-form"
        action={url.registrationAction}
        method="post"
      >
        <YStack>
          <FieldInput
            form={form}
            id="firstName"
            label={msg("firstName")}
            name="firstName"
            tabIndex="0"
            inputProps={{
              autoComplete: "off",
              autoFocus: true,
            }}
            onChangeText={handleChangeFirstName}
          />
          {error.firstName && (
            <Paragraph color="$red9">{error.firstName}</Paragraph>
          )}
          <FieldInput
            form={form}
            id="lastName"
            label={msg("lastName")}
            name="lastName"
            tabIndex="0"
            inputProps={{
              autoComplete: "off",
            }}
            onChangeText={handleChangeLastName}
          />
          {error.lastName && (
            <Paragraph color="$red9">{error.lastName}</Paragraph>
          )}
          <FieldInput
            form={form}
            id="email"
            label={msg("email")}
            name="email"
            tabIndex="0"
            inputProps={{
              autoComplete: "off",
            }}
            onChangeText={handleChangeEmail}
          />
          {error.email && <Paragraph color="$red9">{error.email}</Paragraph>}
          {!realm.registrationEmailAsUsername && (
            <FieldInput
              form={form}
              id="username"
              label={msg("username")}
              name="username"
              tabIndex="0"
              inputProps={{
                autoComplete: "off",
              }}
              onChangeText={handleChangeUsername}
            />
          )}
          {error.username && (
            <Paragraph color="$red9">{error.username}</Paragraph>
          )}
          {passwordRequired && (
            <YStack>
              <FieldInput
                form={form}
                id="password"
                label={msg("password")}
                name="password"
                tabIndex="0"
                inputProps={{
                  autoComplete: "off",
                  secureTextEntry: !showPassword,
                }}
                onChangeText={handleChangePassword}
              />
              {error.password && (
                <Paragraph
                  color={
                    error.password === "password is required"
                      ? "$red9"
                      : "$yellow9"
                  }
                >
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
                  label={msg("passwordConfirm")}
                  // @ts-ignore
                  name="password-confirm"
                  tabIndex="0"
                  inputProps={{
                    autoComplete: "off",
                    secureTextEntry: !showPassword,
                  }}
                  onChangeText={handleChangePasswordConfirm}
                />
                {error["password-confirm"] && (
                  <Paragraph color="$red9">
                    {error["password-confirm"]}
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
              </YStack>
            </YStack>
          )}

          {extraFields.map((field, index) => {
            return (
              <FieldInput
                key={field}
                form={form}
                id={field}
                label={field}
                // @ts-ignore
                name={field}
                tabIndex={mainFields.length + 2 + (index + 1)}
                inputProps={{
                  autoComplete: "off",
                }}
              />
            );
          })}
        </YStack>

        {recaptchaRequired && (
          <YStack>
            <YStack>
              <YStack
                className="g-recaptcha"
                data-size="compact"
                data-sitekey={recaptchaSiteKey}
              />
            </YStack>
          </YStack>
        )}
        <YStack>
          <YStack id="kc-form-options" ai="flex-start" marginVertical="$4">
            <Text>
              <Anchor href={url.loginUrl}>{msg("backToLogin")}</Anchor>
            </Text>
          </YStack>
          <YStack id="kc-form-buttons">
            <SubmitButton
              // disabled={disableRegisterButton}
              bg="$backgroundFocus"
              form={form}
              id="kc-register"
              tabIndex="0"
            >
              <Text fontSize={16}>{msg("doRegister")}</Text>
            </SubmitButton>
          </YStack>
        </YStack>
      </form>
    </Template>
  );
}
