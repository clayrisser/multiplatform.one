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
  const [isValidText, setIsValidText] = React.useState<boolean>(true);

  useEffect(() => {
    props.secureTextEntry ? setHideText(true) : setHideText(false);
  }, [props.secureTextEntry]);

  const handleInputChange = (text: string) => {
    if (inputType === 'EMAIL') {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(text)) {
        setIsValidText(false);
        return;
      } else {
        setIsValidText(true);
      }
    } else {
      setIsValidText(true);
    }
  };

  return (
    <XStack theme={isValidText ? 'system' : 'red'} space="$1" {...xStackProps}>
      <Input {...props} secureTextEntry={hideText} onChangeText={handleInputChange} />
      {inputType === 'PASSWORD' && (
        <Button onPress={() => setHideText(!hideText)}>
          <Button.Icon>{hideText ? <EyeOff /> : <Eye />}</Button.Icon>
        </Button>
      )}
    </XStack>
  );
}
