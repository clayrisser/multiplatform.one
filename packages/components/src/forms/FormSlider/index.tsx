/**
 * File: /src/forms/FormSlider/index.tsx
 * Project: @multiplatform.one/components
 * File Created: 15-02-2024 09:38:13
 * Author: Lavanya Katari
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

/* eslint-disable @typescript-eslint/consistent-type-imports */
import React, { useId } from 'react';
import { SliderProps } from 'tamagui';
import { Slider } from 'tamagui';
import { FieldComponentProps, FormControllerProps } from '../types';
import { FormFieldProps } from '../FormField';
import { FormField } from '../FormField';
import { Field, useForm } from '@tanstack/react-form';
import type { DeepKeys, DeepValue, Validator } from '@tanstack/form-core';

export type FormSliderProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = SliderProps &
  FormControllerProps & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'> &
  Partial<Omit<FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children'>> & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  };

export function FormSlider<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>({
  children,
  defaultValue,
  error,
  fieldProps,
  helperText,
  label,
  name,
  required,
  thumbStyle,
  // tanstack field props
  asyncAlways,
  asyncDebounceMs,
  defaultMeta,
  mode,
  preserveValue,
  validatorAdapter,
  validators,
  form,
  ...switchProps
}: FormSliderProps<TParentData, TName, TFieldValidator, TFormValidator, TData>) {
  form = form || useForm();
  const id = useId();
  if (!form || !name) {
    return (
      <Slider>
        <Slider.Track>
          <Slider.TrackActive />
        </Slider.Track>
        <Slider.Thumb
          bordered
          circular
          elevate
          index={0}
          aria-describedby="my-tooltip"
          position="absolute"
          style={{ height: 10, width: 10 }}
          size={24}
        />
      </Slider>
    );
  }
  return (
    <Field
      asyncAlways={asyncAlways}
      asyncDebounceMs={asyncDebounceMs}
      defaultMeta={defaultMeta}
      defaultValue={defaultValue}
      form={form}
      mode={mode}
      name={name}
      preserveValue={preserveValue}
      validatorAdapter={validatorAdapter}
      validators={validators}
    >
      {(field) => (
        <FormField id={id} error={!!error} helperText={helperText} label={label} required={required} {...fieldProps}>
          <Slider
            defaultValue={defaultValue}
            value={field.state.value as number[]}
            onValueChange={onChange}
            {...switchProps}
          >
            <Slider.Track>
              <Slider.TrackActive />
            </Slider.Track>
            <Slider.Thumb
              alignItems="center"
              justifyContent="center"
              bordered
              circular
              userSelect="none"
              elevate
              index={0}
              {...thumbStyle}
            >
              {field.state.value[0]}
            </Slider.Thumb>
            {children}
          </Slider>
        </FormField>
      )}
    </Field>
  );
}
