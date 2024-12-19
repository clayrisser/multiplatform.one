/**
 * File: /src/login/pages/LoginUpdateProfile.tsx
 * Project: @platform/keycloak
 * File Created: 19-11-2024 20:27:46
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

import { useForm } from "@tanstack/react-form";
import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { clsx } from "keycloakify/tools/clsx";
import { useRef, useState } from "react";
import { FieldInput, Paragraph, SubmitButton, YStack } from "ui";
import type { I18n } from "../i18n";
import type { KcContext } from "../kcContext";

export interface FormError {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
}

export default function LoginUpdateProfile(
  props: PageProps<
    Extract<KcContext, { pageId: "login-update-profile.ftl" }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const formRef = useRef<HTMLFormElement | null>(null);
  const { getClassName } = useGetClassName({
    doUseDefaultCss,
    classes,
  });

  const { msg, msgStr } = i18n;

  const { url, user, messagesPerField, isAppInitiatedAction } = kcContext;

  console.log("user", user);
  console.log("kc context--->", kcContext);

  const mainFields = ["firstName", "lastName", "email", "username"];
  const extraFields = Object.keys(
    // @ts-ignore
    kcContext?.profile?.attributesByName || {},
  ).filter((field) => !mainFields.includes(field));
  const [error, setError] = useState<FormError>({});
  const form = useForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      ...Object.fromEntries(extraFields.map((field) => [field, ""])),
    },
    onSubmit: ({ value }) => {
      console.log("form submitted");
      let flag = false;
      setError({});

      Object.entries(value).forEach(([name, value]) => {
        if (
          name === "firstName" ||
          name === "lastName" ||
          name === "email" ||
          name === "userName"
        ) {
          if (!value || value === "") {
            flag = true;
            setError((prev) => ({ ...prev, [name]: `${name} is required` }));
          }
        }
        if (flag) return;
        if (!value) return;

        const input = document.createElement("input");
        input.name = name;
        if (typeof value === "boolean") {
          input.checked = value;
        } else {
          input.value = value || "";
        }
        input.type = "hidden";
        input.style.display = "none";
        formRef.current?.appendChild(input);
      });
      formRef.current?.submit();
    },
  });

  const handleChangeFirstName = (value: string) => {
    if (!value || value === "") {
      return setError((prev) => ({
        ...prev,
        firstName: "first name is required",
      }));
    }
    setError((prev) => ({ ...prev, firstName: "" }));
  };

  const handleChangeLastName = (value: string) => {
    if (!value || value === "") {
      return setError((prev) => ({
        ...prev,
        lastName: "last name is required",
      }));
    }
    setError((prev) => ({ ...prev, lastName: "" }));
  };

  const handleChangeEmail = (value: string) => {
    if (!value || value === "") {
      return setError((prev) => ({ ...prev, email: "email is required" }));
    }
    setError((prev) => ({ ...prev, email: "" }));
  };

  const handleChangeUserName = (value: string) => {
    if (!value || value === "") {
      return setError((prev) => ({
        ...prev,
        username: "user name is required",
      }));
    }
    setError((prev) => ({ ...prev, username: "" }));
  };

  return (
    <Template
      {...{ kcContext, i18n, doUseDefaultCss, classes }}
      headerNode={msg("loginProfileTitle")}
    >
      <form
        ref={formRef}
        id="kc-update-profile-form"
        action={url.loginAction}
        method="post"
      >
        {user.editUsernameAllowed && (
          // <div
          //   className={clsx(
          //     getClassName('kcFormGroupClass'),
          //     messagesPerField.printIfExists('username', getClassName('kcFormGroupErrorClass')),
          //   )}
          // >
          //   <div className={getClassName('kcLabelWrapperClass')}>
          //     <label htmlFor="username" className={getClassName('kcLabelClass')}>
          //       {msg('username')}
          //     </label>
          //   </div>
          //   <div className={getClassName('kcInputWrapperClass')}>
          //     <input
          //       type="text"
          //       id="username"
          //       name="username"
          //       defaultValue={user.username ?? ''}
          //       className={getClassName('kcInputClass')}
          //     />
          //   </div>
          // </div>
          <FieldInput
            form={form}
            id="username"
            name="username"
            label={msg("username")}
            // @ts-ignore
            type="text"
            onChangeText={handleChangeUserName}
            required
            defaultValue={user.username ?? ""}
          />
        )}
        {error.username && (
          <Paragraph color="$red9">{error.username}</Paragraph>
        )}

        {/* <div
          className={clsx(
            getClassName('kcFormGroupClass'),
            messagesPerField.printIfExists('email', getClassName('kcFormGroupErrorClass')),
          )}
        >
          <div className={getClassName('kcLabelWrapperClass')}>
            <label htmlFor="email" className={getClassName('kcLabelClass')}>
              {msg('email')}
            </label>
          </div>
          <div className={getClassName('kcInputWrapperClass')}>
            <input
              type="text"
              id="email"
              name="email"
              defaultValue={user.email ?? ''}
              className={getClassName('kcInputClass')}
            />
          </div>
        </div> */}
        <FieldInput
          form={form}
          label={msg("email")}
          id="email"
          name="email"
          onChangeText={handleChangeEmail}
          required
          // @ts-ignore
          type="text"
          defaultValue={user.email ?? ""}
        />
        {error.email && <Paragraph color="$red9">{error.email}</Paragraph>}
        {/* <div
          className={clsx(
            getClassName('kcFormGroupClass'),
            messagesPerField.printIfExists('firstName', getClassName('kcFormGroupErrorClass')),
          )}
        >
          <div className={getClassName('kcLabelWrapperClass')}>
            <label htmlFor="firstName" className={getClassName('kcLabelClass')}>
              {msg('firstName')}
            </label>
          </div>
          <div className={getClassName('kcInputWrapperClass')}>
            <input
              type="text"
              id="firstName"
              name="firstName"
              defaultValue={user.firstName ?? ''}
              className={getClassName('kcInputClass')}
            />
          </div>
        </div> */}

        <FieldInput
          form={form}
          label={msg("firstName")}
          id="firstName"
          name="firstName"
          onChangeText={handleChangeFirstName}
          required
          // @ts-ignore
          type="text"
          defaultValue={user.firstName ?? ""}
        />
        {error.firstName && (
          <Paragraph color="$red9">{error.username}</Paragraph>
        )}
        {/* <div
          className={clsx(
            getClassName('kcFormGroupClass'),
            messagesPerField.printIfExists('lastName', getClassName('kcFormGroupErrorClass')),
          )}
        >
          <div className={getClassName('kcLabelWrapperClass')}>
            <label htmlFor="lastName" className={getClassName('kcLabelClass')}>
              {msg('lastName')}
            </label>
          </div>
          <div className={getClassName('kcInputWrapperClass')}>
            <input
              type="text"
              id="lastName"
              name="lastName"
              defaultValue={user.lastName ?? ''}
              className={getClassName('kcInputClass')}
            />
          </div>
        </div> */}

        <FieldInput
          form={form}
          label={msg("lastName")}
          id="lastName"
          name="lastName"
          onChangeText={handleChangeLastName}
          required
          // @ts-ignore
          type="text"
          defaultValue={user.lastName ?? ""}
        />
        {error.lastName && (
          <Paragraph color="$red9">{error.lastName}</Paragraph>
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
        <YStack
        // className={getClassName('kcFormGroupClass')}
        >
          <YStack
            id="kc-form-options"
            // className={getClassName('kcFormOptionsClass')}
          >
            <YStack
            // className={getClassName('kcFormOptionsWrapperClass')}
            />
          </YStack>

          <YStack
            id="kc-form-buttons"
            // className={getClassName('kcFormButtonsClass')}
          >
            {isAppInitiatedAction ? (
              <>
                {/* <input
                  className={clsx(
                    getClassName('kcButtonClass'),
                    getClassName('kcButtonPrimaryClass'),
                    getClassName('kcButtonLargeClass'),
                  )}
                  type="submit"
                  defaultValue={msgStr('doSubmit')}
                /> */}
                <SubmitButton form={form}>{msgStr("doSubmit")}</SubmitButton>
                {/* <button
                  className={clsx(
                    getClassName('kcButtonClass'),
                    getClassName('kcButtonDefaultClass'),
                    getClassName('kcButtonLargeClass'),
                  )}
                  type="submit"
                  name="cancel-aia"
                  value="true"
                >
                  {msg('doCancel')}
                </button> */}
                <SubmitButton
                  form={form}
                  // @ts-ignore
                  type="submit"
                  name="cancel-aia"
                  value="true"
                >
                  {msg("doCancel")}
                </SubmitButton>
              </>
            ) : (
              // <input
              //   className={clsx(
              //     getClassName('kcButtonClass'),
              //     getClassName('kcButtonPrimaryClass'),
              //     getClassName('kcButtonBlockClass'),
              //     getClassName('kcButtonLargeClass'),
              //   )}
              //   type="submit"
              //   defaultValue={msgStr('doSubmit')}
              // />
              <SubmitButton form={form} bg="$backgroundFocus">
                {msgStr("doSubmit")}
              </SubmitButton>
            )}
          </YStack>
        </YStack>
      </form>
    </Template>
  );
}
