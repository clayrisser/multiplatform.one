/* eslint-disable @typescript-eslint/consistent-type-imports */
import React, { useId } from 'react';
import { SliderProps, SliderThumbProps } from 'tamagui';
import { Slider } from 'tamagui';
import { FormControllerProps } from '../types';
import { FormFieldProps } from '../FormField';
import { Controller, useFormContext } from 'react-hook-form';
import { FormField } from '../FormField';

export type FormSliderProps = SliderProps &
  FormControllerProps & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'> & { thumbStyle?: SliderThumbProps };

export function FormSlider({
  children,
  control,
  defaultValue,
  error,
  fieldProps,
  helperText,
  label,
  name,
  required,
  thumbStyle,
  rules,
  ...switchProps
}: FormSliderProps) {
  const formContext = useFormContext();
  const id = useId();
  if (!formContext) {
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
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormField
          id={id}
          error={!!error}
          helperText={error ? error.message : helperText}
          label={label}
          required={required}
          {...fieldProps}
        >
          <Slider defaultValue={defaultValue} value={value} onValueChange={onChange} {...switchProps}>
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
              {value[0]}
            </Slider.Thumb>
            {children}
          </Slider>
        </FormField>
      )}
    />
  );
}
