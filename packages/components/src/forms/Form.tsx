/**
 * File: /src/forms/Form.tsx
 * Project: @multiplatform.one/components
 * File Created: 30-12-2024 18:45:00
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
import { type FormApi, type FormOptions, useForm } from "@tanstack/react-form";
import { createContext, useContext } from "react";
import type { ReactNode } from "react";

export const FormContext = createContext<FormApi<any, any> | undefined>(
  undefined,
);

export function useFormContext<
  TParentData,
  TFormValidator extends Validator<TParentData, unknown> | undefined,
>() {
  return useContext(FormContext) as FormApi<TParentData, TFormValidator>;
}

export type FormProps<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = (
  | {
      form: FormApi<TFormData, TFormValidator>;
    }
  | FormOptions<TFormData, TFormValidator>
) & {
  children: ReactNode;
};

export function Form<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(props: FormProps<TFormData, TFormValidator>) {
  const { children, form, ...formOptions } = props as FormProps<
    TFormData,
    TFormValidator
  > & {
    form?: FormApi<TFormData, TFormValidator>;
  };
  return (
    <FormContext.Provider
      value={form || useForm<TFormData, TFormValidator>(formOptions)}
    >
      {children}
    </FormContext.Provider>
  );
}
