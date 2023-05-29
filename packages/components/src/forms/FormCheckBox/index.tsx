import type { SizeTokens, CheckboxProps, CheckboxIndicatorProps, LabelProps, ThemeName, ThemeKeys } from 'tamagui';
import { Label, Checkbox, XStack, YStack } from 'tamagui';
import { Controller, useFormContext } from 'react-hook-form';
import type { FormControllerProps } from '../types';
import type { FormFieldProps } from '../FormField';
import { FormField } from '../FormField';
import React, { useId } from 'react';
import type { FlexAlignType } from 'react-native';
import { Check as CheckIcon } from '@tamagui/lucide-icons';

export type FormCheckBoxProps = CheckboxProps &
  FormControllerProps & {
    fieldProps?: Omit<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'>;
  } & Pick<FormFieldProps, 'helperText' | 'required' | 'error' | 'label'> & {
    IndicatorStyle?: CheckboxIndicatorProps;
  } & { LabelStyle?: LabelProps } & { iconColor?: string | ThemeName | ThemeKeys };

export interface CheckBoxElement {
  label?: string;
  value: string;
  size?: SizeTokens;
  disabled?: boolean;
  defaultChecked?: boolean;
  id?: string;
}

export interface CheckBoxElementSizing {
  width?: any;
  height?: any;
  space?: SizeTokens;
  ai?: FlexAlignType;
}

export function FormCheckBox({
  children,
  control,
  defaultValue,
  error,
  fieldProps,
  helperText,
  label,
  name,
  required,
  rules,
  checkBoxElement,
  CheckBoxElementSizing,
  IndicatorStyle,
  iconColor,
  LabelStyle,
  ...checkProps
}: FormCheckBoxProps & { checkBoxElement: CheckBoxElement } & { CheckBoxElementSizing?: CheckBoxElementSizing }) {
  const formContext = useFormContext();
  const id = useId();
  if (!formContext) {
    return (
      <YStack>
        <XStack
          space={CheckBoxElementSizing?.space || '$3'}
          height={CheckBoxElementSizing?.height}
          width={CheckBoxElementSizing?.width || '300'}
          ai="center"
        >
          <Checkbox
            id={id}
            size={checkBoxElement.size}
            defaultChecked={checkBoxElement.defaultChecked}
            value={checkBoxElement.value}
            {...checkProps}
          >
            <Checkbox.Indicator>
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox>

          <Label size={checkBoxElement.size} htmlFor={id}>
            {checkBoxElement.label || checkBoxElement.value}
          </Label>
        </XStack>
      </YStack>
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
          <YStack>
            <XStack
              alignItems={CheckBoxElementSizing?.ai || 'center'}
              space={CheckBoxElementSizing?.space || '$3'}
              height={CheckBoxElementSizing?.height}
              width={CheckBoxElementSizing?.width || '300'}
            >
              <Checkbox
                id={id}
                size={checkBoxElement.size}
                defaultChecked={checkBoxElement.defaultChecked}
                value={checkBoxElement.value}
                checked={value}
                {...checkProps}
                onCheckedChange={(e) => {
                  onChange(e);
                  if (checkProps.onCheckedChange) checkProps.onCheckedChange(e);
                }}
              >
                <Checkbox.Indicator {...IndicatorStyle}>
                  <CheckIcon />
                </Checkbox.Indicator>
              </Checkbox>
              <Label size={checkBoxElement.size} htmlFor={id} {...LabelStyle}>
                {checkBoxElement.label || checkBoxElement.value}
              </Label>
            </XStack>
          </YStack>
        </FormField>
      )}
    />
  );
}
