import type { ButtonProps, ColorTokens, InputProps, SizeTokens, ThemeTokens } from 'tamagui';
import { Button, Input, XGroup, YStack } from 'tamagui';
import { Eye, EyeOff } from '@tamagui/lucide-icons';
import React from 'react';
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
  width?: number | undefined;
  height?: number | undefined;
  iconStyle?: ButtonProps;
}

type IconProps = SvgProps & BaseIconProps;

export type SimpleInputProps = Omit<InputProps, 'height' | 'width'> & CustomProps;

export function SimpleInput({
  value,
  size,
  password,
  iconBefore,
  iconAfter,
  height,
  width,
  iconStyle,
  onChangeText,
  ...props
}: SimpleInputProps) {
  const [show, setShow] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string | undefined>(value ?? '');
  const displayValue = inputValue && password ? '*'.repeat(inputValue.length) : inputValue;
  const [borderWidth, setBorderWidth] = React.useState(0);
  const totalIcons = (iconBefore ? 1 : 0) + (iconAfter || password ? 1 : 0);
  const iconWidth = typeof size === 'undefined' && typeof width !== 'undefined' ? width * 0.415 : undefined;
  const containerWidth = width ? width + 0.145 * width * totalIcons : undefined;
  const inputValuePadding = 10;
  const iconPadding = (20 * (iconWidth || 0)) / 100;

  React.useEffect(() => {
    if (value === inputValue) return;
    setInputValue(value);
  }, [value]);

  return (
    <YStack>
      <XGroup
        justifyContent="flex-start"
        alignItems="flex-start"
        height={size}
        // borderRadius={props.borderRadius || size}
        borderRadius={999999}
        borderWidth={borderWidth}
        borderColor="$backgroundFocus"
        minHeight={height}
        width={containerWidth}
      >
        {iconBefore && (
          <Button
            icon={iconBefore}
            size={size}
            height={height}
            unstyled
            paddingVertical={iconPadding}
            paddingLeft={iconPadding}
            {...iconStyle}
          />
        )}
        <Input
          size={size}
          onChangeText={setInputValue}
          onFocus={() => setBorderWidth(1)}
          onBlur={() => setBorderWidth(0)}
          height={height}
          width={width}
          paddingLeft={inputValuePadding}
          paddingRight={inputValuePadding}
          unstyled
          value={show ? inputValue : displayValue}
          borderWidth={0}
        />
        {!!password && (
          <Button
            icon={show ? Eye : EyeOff}
            size={size}
            height={height}
            {...iconStyle}
            onPress={(e) => {
              setShow((prev) => !prev);
              props.onPress?.(e);
            }}
          />
        )}
        {iconAfter && !password && (
          <Button
            icon={iconAfter}
            size={size}
            height={height}
            paddingVertical={iconPadding}
            paddingRight={iconPadding}
            {...iconStyle}
          />
        )}
      </XGroup>
    </YStack>
  );
}
