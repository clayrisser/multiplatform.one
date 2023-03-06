import React from 'react';
import { Button, Theme, XStack, YStack } from 'tamagui';

export function ThemeInverseDemo() {
  return (
    <XStack space>
      <Buttons />
      <Theme inverse>
        <Buttons />
      </Theme>
    </XStack>
  );
}

function Buttons() {
  return (
    <YStack backgroundColor="$background" padding="$3" borderRadius="$3" space>
      <Button>Dark</Button>
      <Button themeInverse>Inversed</Button>
      <Button theme="alt1">Alt1 Dark</Button>
      <Theme name="yellow">
        <Button>Yellow dark</Button>
      </Theme>
    </YStack>
  );
}
