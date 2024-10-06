import { Eye, EyeOff } from "@tamagui/lucide-icons";
import { useForm } from "@tanstack/react-form";
import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { clsx } from "keycloakify/tools/clsx";
import { useCallback, useRef, useState } from "react";
import type { GestureResponderEvent } from "react-native";
import { FieldCheckbox, FieldInput, Paragraph, SubmitButton, YStack } from "ui";
import type { I18n } from "../i18n";
import type { KcContext } from "../kcContext";

export interface LoginUpdatePasswordForm {
  username: string;
  password: string;
  "password-new": string;
  "password-confirm": string;
  "logout-sessions": boolean;
}

export default function LoginUpdatePassword(
  props: PageProps<
    Extract<KcContext, { pageId: "login-update-password.ftl" }>,
    I18n
  >,
) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const formRef = useRef<HTMLFormElement | null>(null);
  const { getClassName } = useGetClassName({
    doUseDefaultCss,
    classes,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handlePassword = useCallback(
    (e: GestureResponderEvent) => {
      e.preventDefault();
      setShowPassword(!showPassword);
    },
    [showPassword],
  );

  const { msg, msgStr } = i18n;

  const { url, messagesPerField, isAppInitiatedAction, username } = kcContext;

  const [error, setError] = useState<{
    newPassword?: string;
    confirmNewPassword?: string;
  }>({});

  const form = useForm({
    defaultValues: {
      username,
      password: "",
      "password-new": "",
      "password-confirm": "",
      ...(isAppInitiatedAction ? { "logout-sessions": true } : {}),
    },
    onSubmit: ({ value }) => {
      Object.entries(value).forEach(([name, value]) => {
        if (!value) return;
        const input = document.createElement("input");
        input.name = name;
        input.value = value === true ? "on" : value;
        input.type = "hidden";
        input.style.display = "none";
        formRef.current?.appendChild(input);
      });
      formRef.current?.submit();
    },
  });

  function handleNewPassword(text: string) {
    let errorMessage = "";

    if (!text) {
      errorMessage = "Password is required";
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\]{};':"\\|,.<>?])[A-Za-z\d!@#$%^&*()_+\-=\]{};':"\\|,.<>?]{6,15}$/;

      if (!passwordRegex.test(text)) {
        errorMessage =
          "Password must have at least one lowercase letter, one uppercase letter, one number, one special character, and be between 6 and 15 characters long";
      }
    }

    setError((prev) => ({ ...prev, newPassword: errorMessage }));
  }

  function handleConfirmPassword(text: string) {
    if (!text) {
      return setError((prev) => ({
        ...prev,
        confirmNewPassword: "confirm password is required",
      }));
    }
    if (text !== form.state.values["password-new"]) {
      return setError((prev) => ({
        ...prev,
        confirmNewPassword: "password is not matching",
      }));
    }
    return setError((prev) => ({
      ...prev,
      confirmNewPassword: "",
    }));
  }

  return (
    <Template
      {...{ kcContext, i18n, doUseDefaultCss, classes }}
      headerNode={msg("updatePasswordTitle")}
    >
      <form
        id="kc-passwd-update-form"
        ref={formRef}
        className={getClassName("kcFormClass")}
        action={url.loginAction}
        method="post"
      >
        <FieldInput
          // @ts-ignore
          type="text"
          id="username"
          name="username"
          readOnly={true}
          autoComplete="username"
          display="none"
        />

        <FieldInput
          // @ts-ignore
          type="password"
          id="password"
          name="password"
          autoComplete="current-password"
          display="none"
          form={form}
          required
        />

        <YStack
        // className={clsx(
        //   getClassName('kcFormGroupClass'),
        //   messagesPerField.printIfExists('password', getClassName('kcFormGroupErrorClass')),
        // )}
        >
          <YStack position="relative">
            <FieldInput
              label={msg("passwordNew")}
              // @ts-ignore
              type="password"
              id="password-new"
              name="password-new"
              autoFocus
              form={form}
              required
              autoComplete="new-password"
              onChangeText={handleNewPassword}
              inputProps={{
                autoComplete: "off",
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
              paddingLeft={4}
            >
              {showPassword ? <EyeOff size="$1.5" /> : <Eye size="$1.5" />}
            </YStack>
          </YStack>
        </YStack>
        {/* {error.newPassword && <Paragraph color="$red9">{error.newPassword}</Paragraph>} */}
        {error.newPassword && (
          <Paragraph
            color={
              error.newPassword === "Password is required"
                ? "$red9"
                : "$yellow9"
            }
          >
            {error.newPassword}
          </Paragraph>
        )}
        <YStack
        // className={clsx(
        //   getClassName('kcFormGroupClass'),
        //   messagesPerField.printIfExists('password-confirm', getClassName('kcFormGroupErrorClass')),
        // )}
        >
          <YStack position="relative">
            <FieldInput
              label={msg("passwordConfirm")}
              // @ts-ignore
              type="password"
              id="password-confirm"
              name="password-confirm"
              form={form}
              autoComplete="new-password"
              onChangeText={handleConfirmPassword}
              inputProps={{
                autoComplete: "off",
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
              paddingLeft={4}
            >
              {showPassword ? <EyeOff size="$1.5" /> : <Eye size="$1.5" />}
            </YStack>
          </YStack>
          {error.confirmNewPassword && (
            <Paragraph color="$red9">{error.confirmNewPassword}</Paragraph>
          )}
        </YStack>

        <YStack className={getClassName("kcFormGroupClass")}>
          <YStack
            id="kc-form-options"
            className={getClassName("kcFormOptionsClass")}
          >
            <YStack className={getClassName("kcFormOptionsWrapperClass")}>
              {isAppInitiatedAction && (
                <YStack className="checkbox">
                  <FieldCheckbox
                    form={form}
                    id="logout-sessions"
                    name="logout-sessions"
                    label={msgStr("logoutOtherSessions")}
                    // @ts-ignore
                    value="on"
                    checked
                  />
                </YStack>
              )}
            </YStack>
          </YStack>

          <YStack
            id="kc-form-buttons"
            className={getClassName("kcFormButtonsClass")}
          >
            {isAppInitiatedAction ? (
              <>
                <SubmitButton form={form}>{msgStr("doSubmit")}</SubmitButton>
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
              //   value={msgStr('doSubmit')}
              // />
              <SubmitButton bg="$backgroundFocus" form={form}>
                {msgStr("doSubmit")}
              </SubmitButton>
            )}
          </YStack>
        </YStack>
      </form>
    </Template>
  );
}
