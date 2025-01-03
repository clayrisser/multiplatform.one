/**
 * File: /src/forms/Button/SubmitButton.tsx
 * Project: @multiplatform.one/components
 * File Created: 20-06-2024 06:03:52
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

import type { Validator } from "@tanstack/form-core";
import type { FormApi } from "@tanstack/react-form";
import { useForm } from "@tanstack/react-form";
import { useFormContext } from "../Form";
import type { ButtonProps } from "./Button";
import { Button } from "./Button";

export type SubmitButtonProps<
  TParentData = any,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
> = ButtonProps & {
  form?: FormApi<TParentData, TFormValidator>;
};

export function SubmitButton<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
>({
  form,
  onPress,
  ...buttonProps
}: SubmitButtonProps<TParentData, TFormValidator>) {
  const formContext = useFormContext();
  form =
    form || (formContext as FormApi<TParentData, TFormValidator>) || useForm();
  return (
    <Button
      onPress={(e) => {
        e.preventDefault();
        if (onPress) onPress(e);
        form.handleSubmit();
      }}
      {...buttonProps}
    />
  );
}
