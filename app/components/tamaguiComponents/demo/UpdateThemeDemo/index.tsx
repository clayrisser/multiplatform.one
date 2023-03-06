import * as Config from 'app/components/config/tamaguiConfig';
import React, { useState } from 'react';
import {
  Button,
  Square,
  Theme,
  YStack,
  addTheme,
  getVariableValue,
  updateTheme,
  useForceUpdate,
  useIsomorphicLayoutEffect,
} from 'tamagui';

const colors = Config.config.tokens.color;
const colorKeys = Object.keys(colors);

export function UpdateThemeDemo() {
  const [theme, setTheme] = useState<any>();
  const update = useForceUpdate();

  useIsomorphicLayoutEffect(() => {
    addTheme({
      name: 'custom',
      insertCSS: true,
      theme: {
        color: 'red',
      },
    });
    setTheme('custom');
  }, []);

  return (
    <YStack alignItems="center" space>
      <Theme name={theme ?? null}>
        <Square borderRadius="$8" size={100} backgroundColor="$color" />
      </Theme>

      <Button
        onPress={() => {
          const randomColor = getVariableValue(colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]]);
          updateTheme({
            name: 'custom',
            theme: {
              color: randomColor,
            },
          });
          update();
        }}
      >
        Set to random color
      </Button>
    </YStack>
  );
}
