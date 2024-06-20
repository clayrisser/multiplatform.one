/**
 * File: /src/forms/Slider/FieldSlider.tsx
 * Project: @multiplatform.one/components
 * File Created: 19-06-2024 09:37:30
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

import React, { useId } from 'react';
import type { DeepKeys, DeepValue, Validator } from '@tanstack/form-core';
import type { FieldComponentProps } from '../types';
import type { FormFieldProps } from '../FormField';
import type { SliderProps } from './Slider';
import type { SliderThumbProps } from 'tamagui';
import { FormField } from '../FormField';
import { Slider } from './Slider';
import { useForm, Field } from '@tanstack/react-form';
import { useProps } from 'tamagui';

export type FieldSliderProps<
  TParentData = any,
  TName extends DeepKeys<TParentData> = any,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = Omit<FormFieldProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children' | 'field'> &
  Pick<SliderProps, 'value' | 'onValueChange'> &
  Partial<Omit<FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children'>> & {
    sliderProps?: Omit<SliderProps, 'value' | 'id' | 'onValueChange'>;
    thumbProps?: SliderThumbProps;
  };

export function FieldSlider<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(props: FieldSliderProps<TParentData, TName, TFieldValidator, TFormValidator, TData>) {
  let {
    asyncAlways,
    asyncDebounceMs,
    defaultMeta,
    defaultValue,
    form,
    mode,
    name,
    onBlur,
    onValueChange,
    preserveValue,
    sliderProps,
    thumbProps,
    validatorAdapter,
    validators,
    value,
    ...fieldProps
  } = useProps(props);
  form = form || useForm();
  const id = fieldProps.id || useId();
  if (!form || !name) {
    return (
      <FormField {...fieldProps} id={id} onBlur={onBlur}>
        <Slider {...sliderProps} id={id} defaultValue={defaultValue as number[]} onValueChange={onValueChange}>
          <Slider.Track>
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb bordered circular elevate size="$2" index={0} {...thumbProps} />
        </Slider>
      </FormField>
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
      {(field) => {
        const error = field.state.meta.errors.length ? field.state.meta.errors.join(', ') : fieldProps.error;
        return (
          <FormField
            error={error}
            {...fieldProps}
            id={id}
            onBlur={(e) => {
              field.handleBlur();
              return onBlur?.(e);
            }}
          >
            <Slider
              {...sliderProps}
              id={id}
              defaultValue={(defaultValue as number[]) ?? field.state.value}
              onValueChange={(value) => {
                field.handleChange(value as TData);
                return onValueChange?.(value);
              }}
            >
              <Slider.Track>
                <Slider.TrackActive />
              </Slider.Track>
              <Slider.Thumb bordered circular elevate size="$2" index={0} {...thumbProps} />
            </Slider>
          </FormField>
        );
      }}
    </Field>
  );
}
