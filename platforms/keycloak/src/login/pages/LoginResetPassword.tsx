/**
 * File: /src/login/pages/LoginResetPassword.tsx
 * Project: @platform/keycloak
 * File Created: 01-07-2024 16:49:14
 * Author: Lalit rajak
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

import { useForm } from "@tanstack/react-form";
import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { clsx } from "keycloakify/tools/clsx";
import { useRef } from "react";
import { Anchor, FieldInput, SubmitButton, YStack } from "ui";
import type { I18n } from "../i18n";
import type { KcContext } from "../kcContext";

export default function LoginResetPassword(
  props: PageProps<
    Extract<KcContext, { pageId: "login-reset-password.ftl" }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const formRef = useRef<HTMLFormElement | null>(null);
  const { getClassName } = useGetClassName({
    doUseDefaultCss,
    classes,
  });
  const { url, realm, auth } = kcContext;
  const { msg, msgStr } = i18n;
  const form = useForm({
    defaultValues: {
      username: "",
    },
    onSubmit: async ({ value }) => {
      Object.entries(value).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.name = name;
        input.value = value || "";
        input.type = "hidden";
        input.style.display = "none";
        formRef.current?.appendChild(input);
      });
      formRef.current?.submit();
    },
  });

  return (
    <Template
      {...{ kcContext, i18n, doUseDefaultCss, classes }}
      displayMessage={false}
      headerNode={msg("emailForgotTitle")}
      infoNode={msg("emailInstruction")}
    >
      <form
        ref={formRef}
        id="kc-reset-password-form"
        action={url.loginAction}
        method="post"
      >
        <YStack>
          <FieldInput
            form={form}
            label={
              !realm.loginWithEmailAllowed
                ? msg("username")
                : !realm.registrationEmailAsUsername
                  ? msg("usernameOrEmail")
                  : msg("email")
            }
            id="username"
            name="username"
            defaultValue={
              auth?.showUsername ? auth.attemptedUsername : undefined
            }
          />
        </YStack>
        <YStack>
          <YStack marginVertical="$4" id="kc-form-options">
            <Anchor href={url.loginUrl}>{msg("backToLogin")}</Anchor>
          </YStack>

          <YStack id="kc-form-buttons">
            <SubmitButton form={form} bg="$backgroundFocus">
              {msgStr("doSubmit")}
            </SubmitButton>
          </YStack>
        </YStack>
      </form>
    </Template>
  );
}
