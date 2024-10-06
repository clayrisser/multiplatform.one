import { Eye, EyeOff } from "@tamagui/lucide-icons";
import { useForm } from "@tanstack/react-form";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { clsx } from "keycloakify/tools/clsx";
import { useCallback, useRef, useState } from "react";
import type { GestureResponderEvent } from "react-native";
import {
  Anchor,
  FieldCheckbox,
  FieldInput,
  Paragraph,
  SubmitButton,
  Text,
  XStack,
  YStack,
} from "ui";
import type { I18n } from "../i18n";
import type { KcContext } from "../kcContext";

export interface FormError {
  username?: string;
  password?: string;
}

export default function Login({
  kcContext,
  i18n,
  doUseDefaultCss,
  Template,
  classes,
}: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const {
    social,
    realm,
    url,
    usernameHidden,
    registrationDisabled,
    login,
    auth,
  } = kcContext;
  const { msg, msgStr } = i18n;
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<FormError>({});
  const form = useForm({
    defaultValues: {
      credentialId: auth.selectedCredential,
      password: "",
      rememberMe:
        realm.rememberMe && !usernameHidden
          ? login.rememberMe === "on"
          : undefined,
      username: login.username ?? "",
    },
    onSubmit: ({ value }) => {
      setIsLoginButtonDisabled(true);
      setError({});
      let flag = false;
      Object.entries(value).forEach(([name, value]) => {
        if (name === "username" || name === "password") {
          if (!value || value === "") {
            flag = true;
            setError((prev) => ({ ...prev, [name]: `${name} is required` }));
          }
        }
        if (flag) return;
        if (!value) return;
        if (name === "email" || name === "usernameOrEmail") name = "username";
        if (
          name === "username" &&
          formRef.current?.querySelector('input[name="username"]')
        )
          return;
        const input = document.createElement("input");
        input.name = name;
        input.value = value === true ? "on" : value;
        input.type = "hidden";
        input.style.display = "none";
        formRef.current?.appendChild(input);
      });
      if (!formRef.current?.querySelector('input[name="credentialId"]')) {
        const input = document.createElement("input");
        input.name = "credentialId";
        input.value = "";
        input.type = "hidden";
        input.style.display = "none";
        formRef.current?.appendChild(input);
      }
      if (flag) return;
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

  const handleChangeUsername = (value: string) => {
    if (!value || value === "") {
      return setError((prev) => ({
        ...prev,
        username: "user name is required",
      }));
    }
    setError((prev) => ({ ...prev, username: "" }));
  };

  const handleChangePassword = (value: string) => {
    if (!value || value === "") {
      return setError((prev) => ({
        ...prev,
        password: "password is required",
      }));
    }
    setError((prev) => ({ ...prev, password: "" }));
  };

  return (
    <Template
      {...{ kcContext, i18n, doUseDefaultCss, classes }}
      displayInfo={
        realm.password && realm.registrationAllowed && !registrationDisabled
      }
      displayWide={realm.password && social.providers !== undefined}
      headerNode={msg("doLogIn")}
      infoNode={
        <XStack als="center" marginVertical="$5" id="kc-registration">
          <Text fontSize={16}>
            {msg("noAccount")}
            <Anchor fontSize={16} tabIndex="0" href={url.registrationUrl}>
              {" "}
              {msg("doRegister")}
            </Anchor>
          </Text>
        </XStack>
      }
    >
      <YStack id="kc-form" gap="$4" width="100%">
        <YStack id="kc-form-wrapper" width="100%">
          {realm.password && (
            <YStack>
              <form
                action={url.loginAction}
                id="kc-form-login"
                method="post"
                ref={formRef}
              >
                <YStack>
                  {!usernameHidden &&
                    (() => {
                      const label = !realm.loginWithEmailAllowed
                        ? "username"
                        : realm.registrationEmailAsUsername
                          ? "email"
                          : "usernameOrEmail";
                      const autoCompleteHelper: typeof label =
                        label === "usernameOrEmail" ? "username" : label;
                      return (
                        <YStack>
                          <FieldInput
                            form={form}
                            id={autoCompleteHelper}
                            label={msg(label)}
                            // @ts-ignore
                            name={autoCompleteHelper}
                            tabIndex="0"
                            inputProps={{
                              autoComplete: "off",
                              autoFocus: true,
                            }}
                            onChangeText={handleChangeUsername}
                            required
                          />
                          {error.username && (
                            <Paragraph color="$red9">
                              {error.username}
                            </Paragraph>
                          )}
                        </YStack>
                      );
                    })()}
                </YStack>
                <YStack position="relative">
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
                    required
                    onChangeText={handleChangePassword}
                  />
                  {error.password && (
                    <Paragraph color="$red9">{error.password}</Paragraph>
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
                    paddingLeft={4}
                  >
                    {showPassword ? (
                      <EyeOff size="$1.5" />
                    ) : (
                      <Eye size="$1.5" />
                    )}
                  </YStack>
                </YStack>
                <XStack ai="center" jc="space-between">
                  <YStack id="kc-form-options">
                    {realm.rememberMe && !usernameHidden && (
                      <XStack jc="center" ai="center" gap="$2">
                        <FieldCheckbox
                          form={form}
                          id="rememberMe"
                          label={msg("rememberMe")}
                          name="rememberMe"
                          tabIndex="0"
                        />
                      </XStack>
                    )}
                  </YStack>
                  <YStack>
                    {realm.resetPasswordAllowed && (
                      <Anchor tabIndex="0" href={url.loginResetCredentialsUrl}>
                        {msg("doForgotPassword")}
                      </Anchor>
                    )}
                  </YStack>
                </XStack>
                <YStack id="kc-form-buttons">
                  <SubmitButton
                    bg="$backgroundFocus"
                    // disabled={isLoginButtonDisabled}
                    form={form}
                    id="kc-login"
                    tabIndex="0"
                  >
                    {msgStr("doLogIn")}
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
                  className={clsx("zocial", p.providerId)}
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
