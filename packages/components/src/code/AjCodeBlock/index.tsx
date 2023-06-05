import React, { useState, useRef } from 'react';
import { Clipboard, Platform } from 'react-native';
import { YStack, Text, Button } from 'tamagui';

export interface AjCodeBlockProps {
  children?: any;
}
export const AjCodeBlock = (props: AjCodeBlockProps) => {
  const textRef = useRef();
  const [copy, setCopy] = useState(false);
  function handleChange() {
    Clipboard.setString(props.children);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  }
  return (
    <YStack bg="$backgroundFocus">
      <Text>{props.children}</Text>
      <YStack>
        <Button onPress={() => handleChange()}>{copy ? 'Copied' : 'Copy'}</Button>
      </YStack>
    </YStack>
  );
};
