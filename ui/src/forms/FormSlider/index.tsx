import React, { useId } from 'react';
import { Slider, SliderProps, SliderThumbProps } from 'tamagui';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControllerProps } from '../types';
import { FormField, FormFieldProps } from '../FormField';

export type FormSliderProps = SliderProps &
  FormControllerProps & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'> & { thumbProps?: SliderThumbProps };

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
  thumbProps,
  rules,
  ...switchProps
}: FormSliderProps) {
  const formContext = useFormContext();
  const id = useId();
  if (!formContext) {
    return (
      <Slider defaultValue={defaultValue} {...switchProps}>
        <Slider.Track>
          <Slider.TrackActive />
        </Slider.Track>
        <Slider.Thumb bordered circular elevate index={0} aria-describedby="my-tooltip" position="absolute" />
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

            <Slider.Thumb ai="center" jc="center" bordered circular userSelect="none" elevate index={0} {...thumbProps}>
              {value[0]}
            </Slider.Thumb>
            {children}
          </Slider>
        </FormField>
      )}
    />
  );
}
