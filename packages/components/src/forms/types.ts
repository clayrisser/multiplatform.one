/*
 * File: /src/forms/types.ts
 * Project: @multiplatform.one/components
 * File Created: 10-10-2023 06:39:34
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

import type {
  DeepKeys,
  DeepValue,
  FieldApi,
  FieldApiOptions,
  Validator,
} from "@tanstack/form-core";
import type { FunctionComponent } from "rehackt";

export type UseFieldOptions<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = FieldApiOptions<
  TParentData,
  TName,
  TFieldValidator,
  TFormValidator,
  TData
> & {
  mode?: "value" | "array";
};

export type NodeType = ReturnType<FunctionComponent>;

export type FieldComponentProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = {
  children: (
    fieldApi: FieldApi<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData
    >,
  ) => NodeType;
} & UseFieldOptions<TParentData, TName, TFieldValidator, TFormValidator, TData>;
