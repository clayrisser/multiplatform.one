/**
 * File: /src/login/pages/shared/UserProfileFormFields.tsx
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

import type { ClassKey } from "keycloakify/login/TemplateProps";
import type { Attribute } from "keycloakify/login/kcContext/KcContext";
import { useFormValidation } from "keycloakify/login/lib/useFormValidation";
import { clsx } from "keycloakify/tools/clsx";
import { Fragment, useEffect } from "react";
import type { I18n } from "../../i18n";

export interface UserProfileFormFieldsProps {
  AfterField?: (props: { attribute: Attribute }) => JSX.Element | null;
  BeforeField?: (props: { attribute: Attribute }) => JSX.Element | null;
  getClassName: (classKey: ClassKey) => string;
  i18n: I18n;
  kcContext: Parameters<typeof useFormValidation>[0]["kcContext"];
  onIsFormSubmittableValueChange: (isFormSubmittable: boolean) => void;
}

export function UserProfileFormFields({
  kcContext,
  onIsFormSubmittableValueChange,
  i18n,
  getClassName,
  BeforeField,
  AfterField,
}: UserProfileFormFieldsProps) {
  const { advancedMsg, msg } = i18n;
  const {
    formValidationState: { fieldStateByAttributeName, isFormSubmittable },
    formValidationDispatch,
    attributesWithPassword,
  } = useFormValidation({
    kcContext,
    i18n,
  });
  useEffect(() => {
    onIsFormSubmittableValueChange(isFormSubmittable);
  }, [isFormSubmittable]);
  let currentGroup = "";
  return (
    <>
      {attributesWithPassword.map((attribute, i) => {
        const {
          group = "",
          groupDisplayHeader = "",
          groupDisplayDescription = "",
        } = attribute;
        const { value, displayableErrors } =
          fieldStateByAttributeName[attribute.name];
        const formGroupClassName = clsx(
          getClassName("kcFormGroupClass"),
          displayableErrors.length !== 0 &&
            getClassName("kcFormGroupErrorClass"),
        );
        const groupChanged = group !== currentGroup;
        if (groupChanged) {
          currentGroup = group;
        }
        return (
          <Fragment key={i}>
            {groupChanged && currentGroup !== "" && (
              <div className={formGroupClassName}>
                <div className={getClassName("kcContentWrapperClass")}>
                  <label
                    id={`header-${group}`}
                    className={getClassName("kcFormGroupHeader")}
                  >
                    {advancedMsg(groupDisplayHeader) || currentGroup}
                  </label>
                </div>
                {groupDisplayDescription !== "" && (
                  <div className={getClassName("kcLabelWrapperClass")}>
                    <label
                      id={`description-${group}`}
                      className={getClassName("kcLabelClass")}
                    >
                      {advancedMsg(groupDisplayDescription)}
                    </label>
                  </div>
                )}
              </div>
            )}
            {BeforeField && <BeforeField attribute={attribute} />}
            <div className={formGroupClassName}>
              <div className={getClassName("kcLabelWrapperClass")}>
                <label
                  htmlFor={attribute.name}
                  className={getClassName("kcLabelClass")}
                >
                  {advancedMsg(attribute.displayName ?? "")}
                </label>
                {attribute.required && "*"}
              </div>
              <div className={getClassName("kcInputWrapperClass")}>
                {(() => {
                  const { options } = attribute.validators;
                  if (options !== undefined) {
                    return (
                      <select
                        id={attribute.name}
                        name={attribute.name}
                        onChange={(event) =>
                          formValidationDispatch({
                            action: "update value",
                            name: attribute.name,
                            newValue: event.target.value,
                          })
                        }
                        onBlur={() =>
                          formValidationDispatch({
                            action: "focus lost",
                            name: attribute.name,
                          })
                        }
                        value={value}
                      >
                        <option value="" selected disabled hidden>
                          {msg("selectAnOption")}
                        </option>
                        {options.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    );
                  }
                  return (
                    <input
                      type={(() => {
                        switch (attribute.name) {
                          case "password-confirm":
                          case "password":
                            return "password";
                          default:
                            return "text";
                        }
                      })()}
                      id={attribute.name}
                      name={attribute.name}
                      value={value}
                      onChange={(event) =>
                        formValidationDispatch({
                          action: "update value",
                          name: attribute.name,
                          newValue: event.target.value,
                        })
                      }
                      onBlur={() =>
                        formValidationDispatch({
                          action: "focus lost",
                          name: attribute.name,
                        })
                      }
                      className={getClassName("kcInputClass")}
                      aria-invalid={displayableErrors.length !== 0}
                      disabled={attribute.readOnly}
                      autoComplete={attribute.autocomplete}
                    />
                  );
                })()}
                {displayableErrors.length !== 0 &&
                  (() => {
                    const divId = `input-error-${attribute.name}`;
                    return (
                      <>
                        <style>{`#${divId} > span: { display: block; }`}</style>
                        <span
                          id={divId}
                          className={getClassName("kcInputErrorMessageClass")}
                          style={{
                            position:
                              displayableErrors.length === 1
                                ? "absolute"
                                : undefined,
                          }}
                          aria-live="polite"
                        >
                          {displayableErrors.map(
                            ({ errorMessage }) => errorMessage,
                          )}
                        </span>
                      </>
                    );
                  })()}
              </div>
            </div>
            {AfterField && <AfterField attribute={attribute} />}
          </Fragment>
        );
      })}
    </>
  );
}
