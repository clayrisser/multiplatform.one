import React, { useEffect } from 'react';
import type { ButtonProps, InputProps, XStackProps } from 'tamagui';
import { Button, Input, XGroup, XStack } from 'tamagui';
import { Eye, EyeOff } from '@tamagui/lucide-icons';

export type SimpleInputProps = InputProps & {
  inputType?: 'EMAIL' | 'TEXT' | 'PASSWORD';
  xStackProps?: XStackProps;
  buttonProps?: ButtonProps;
};

export function SimpleInput({ inputType = 'TEXT', xStackProps, buttonProps, ...props }: SimpleInputProps) {
  const [hideText, setHideText] = React.useState<boolean>(
    props?.secureTextEntry || inputType === 'PASSWORD' ? true : false,
  );

  console.log('sec', props.secureTextEntry, 'hide', hideText);

  return (
    <XStack space="$1" {...xStackProps}>
      <Input {...props} secureTextEntry={hideText} />
      {inputType === 'PASSWORD' && (
        <Button onPress={() => setHideText(!hideText)}>
          <Button.Icon>{hideText ? <EyeOff /> : <Eye />}</Button.Icon>
        </Button>
      )}
    </XStack>
  );
}
