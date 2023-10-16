import type { ButtonProps, ColorTokens, InputProps, SizeTokens, ThemeTokens, XStackProps } from 'tamagui';
import { Button, Input, XGroup, XStack } from 'tamagui';
import { Eye, EyeOff } from '@tamagui/lucide-icons';
import React, { useEffect } from 'react';
import type { SvgProps } from 'react-native-svg';

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

type IconProps = SvgProps & BaseIconProps;

export type SimpleInputProps = InputProps & CustomProps & XStackProps;

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
            jc="center"
            ai="center"
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
            jc="center"
            ai="center"
            padding={0}
          />
        )}
        {!!iconAfter && (!password || passwordWithoutIcon) && (
          <Button
            icon={iconAfter}
            {...iconStyle}
            jc="center"
            ai="center"
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
