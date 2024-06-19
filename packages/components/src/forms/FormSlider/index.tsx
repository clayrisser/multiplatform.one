/* eslint-disable @typescript-eslint/consistent-type-imports */
import React, { useId } from 'react';
import { SliderProps, SliderThumbProps } from 'tamagui';
import { Slider } from 'tamagui';
import { FieldComponentProps, FormControllerProps } from '../types';
import type { DeepKeys, DeepValue, Validator } from '@tanstack/form-core';
import { FormFieldProps } from '../FormField';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from '../FormField';
import { Field, useForm } from '@tanstack/react-form';

export type FormSliderProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = SliderProps &
  FormControllerProps &
  Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'> &
  Partial<Omit<FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator, TData>, 'children'>> & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & { thumbStyle?: SliderThumbProps };

export function FormSlider<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, TName>, unknown> | undefined = undefined,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>({
  children,
  error,
  fieldProps,
  helperText,
  label,
  required,
  thumbStyle,
  asyncAlways,
  asyncDebounceMs,
  defaultMeta,
  defaultValue,
  form,
  mode,
  name,
  preserveValue,
  validatorAdapter,
  validators,
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
            value={field.state.value as any}
            {...switchProps}
            onBlur={(e) => {
              field.handleBlur();
              return switchProps.onBlur?.(e);
            }}
            onValueChange={(value) => {
              field.handleChange(value as TData);
              return switchProps.onValueChange?.(value);
            }}
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
              {field.state.value}
            </Slider.Thumb>

            {children}
          </Slider>
        </FormField>
      )}
    </Field>
  );
}
