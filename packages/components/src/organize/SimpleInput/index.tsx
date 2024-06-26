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
  const [isValidEmail, seIsValidEmail] = React.useState<boolean>(true);

  const isEmail = inputType === 'EMAIL';

  useEffect(() => {
    props.secureTextEntry ? setHideText(true) : setHideText(false);
  }, [props.secureTextEntry]);

  const handleInputChange = (text: string) => {
    if (isEmail) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(text)) {
        seIsValidEmail(false);
        return;
      } else {
        seIsValidEmail(true);
      }
    }
  };

  return (
    <XStack theme={isValidEmail ? 'system' : 'red'} space="$1" {...xStackProps}>
      <Input {...props} secureTextEntry={hideText} onChangeText={handleInputChange} />
      {inputType === 'PASSWORD' && (
        <Button onPress={() => setHideText(!hideText)}>
          <Button.Icon>{hideText ? <EyeOff /> : <Eye />}</Button.Icon>
        </Button>
      )}
    </XStack>
  );
}
