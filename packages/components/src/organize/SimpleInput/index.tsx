/**
 * File: /src/organize/SimpleInput/index.tsx
 * Project: @multiplatform.one/components
 * File Created: 18-10-2023 15:23:17
 * Author: Lalit rajak
 * -----
 * BitSpur (c) Copyright 2021 - 2023
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

import React, { useEffect } from 'react';
import type { ButtonProps, ColorTokens, InputProps, SizeTokens, ThemeTokens, XStackProps } from 'tamagui';
import type { IconProps } from '@tamagui/helpers-icon';
import { Button, Input, XGroup, XStack } from 'tamagui';
import { Eye, EyeOff } from '@tamagui/lucide-icons';

export interface BaseIconProps {
  size?: number | SizeTokens;
  strokeWidth?: number | SizeTokens;
  color?: (ColorTokens | ThemeTokens | (string & {})) | null;
  disableTheme?: boolean;
  style?: any;
}

interface CustomProps {
  password?: boolean;
  iconBefore?: React.NamedExoticComponent<IconProps>;
  iconAfter?: React.NamedExoticComponent<IconProps>;
  iconStyle?: ButtonProps;
  circular?: boolean;
  iconBeforeScale?: number;
  iconAfterScale?: number;
  iconPasswordScale?: number;
  iconsAsButton?: boolean;
  iconBeforeAsButton?: boolean;
  iconAfterAsButton?: boolean;
  passwordWithoutIcon?: boolean;
}

export type SimpleInputProps = Omit<InputProps & CustomProps & XStackProps, 'ref'>;

export function SimpleInput({
  value,
  size,
  password,
  iconBefore,
  iconAfter,
  height,
  width,
  iconStyle,
  circular,
  placeholder,
  iconAfterScale,
  iconBeforeScale,
  iconPasswordScale,
  iconAfterAsButton,
  iconBeforeAsButton,
  iconsAsButton,
  passwordWithoutIcon,
  paddingHorizontal,
  onChangeText,
  ...props
}: SimpleInputProps) {
  const [show, setShow] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string | undefined>(value ?? '');
  const [borderWidth, setBorderWidth] = React.useState(1);
  const [secureTextEntry, setSecureTextEntry] = React.useState(password);
  const totalIcons = (iconBefore ? 1 : 0) + (iconAfter || (password && !passwordWithoutIcon) ? 1 : 0);
  const inputValuePadding = iconBefore ? 0 : 24;
  const iconPercentage = totalIcons === 1 ? '20%' : totalIcons === 2 ? '10%' : undefined;
  const inputPercentage = iconPercentage ? '80%' : '100%';

  useEffect(() => {
    if (!inputValue) return;
    if (onChangeText) onChangeText(inputValue);
  }, [inputValue]);

  useEffect(() => {
    if (!password) return;
    if (show) {
      setSecureTextEntry(!!false);
      return;
    }
    if (!show && password) {
      setSecureTextEntry(!!true);
      return;
    }
  }, [password, show]);

  function handleValueChange(text: string) {
    setInputValue(text);
    if (onChangeText) onChangeText(text);
  }

  return (
    <XStack>
      <XGroup
        {...props}
        height={size}
        // @ts-ignore
        borderRadius={circular ? 9999999 : props.borderRadius || size}
        borderWidth={borderWidth}
        borderColor="$backgroundFocus"
        minHeight={height || '$5'}
        width={width || '$20'}
      >
        {iconBefore && (
          <Button
            icon={iconBefore}
            unstyled={!(iconsAsButton || iconBeforeAsButton)}
            {...iconStyle}
            justifyContent="center"
            alignItems="center"
            scaleIcon={iconBeforeScale}
            width={iconPercentage}
            height="100%"
            padding={0}
          />
        )}
        <Input
          onChangeText={handleValueChange}
          value={inputValue}
          {...props}
          size={size}
          onFocus={(e) => {
            setBorderWidth(2);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setBorderWidth(1);
            props.onBlur?.(e);
          }}
          height="100%"
          placeholder={placeholder}
          width={inputPercentage}
          paddingLeft={inputValuePadding}
          paddingRight={inputValuePadding}
          unstyled
          borderWidth={0}
          paddingHorizontal={paddingHorizontal}
          secureTextEntry={secureTextEntry}
        />
        {!!password && !passwordWithoutIcon && (
          <Button
            icon={show ? Eye : EyeOff}
            scaleIcon={iconPasswordScale}
            height="100%"
            {...iconStyle}
            width={iconPercentage}
            onPress={(e) => {
              setShow((prev) => !prev);
              setBorderWidth(2);
              props.onPress?.(e);
            }}
            justifyContent="center"
            alignItems="center"
            padding={0}
          />
        )}
        {!!iconAfter && (!password || passwordWithoutIcon) && (
          <Button
            icon={iconAfter}
            {...iconStyle}
            justifyContent="center"
            alignItems="center"
            scaleIcon={iconBeforeScale}
            width={iconPercentage}
            unstyled={!(iconsAsButton || iconAfterAsButton)}
            height="100%"
            padding={0}
          />
        )}
      </XGroup>
    </XStack>
  );
}
