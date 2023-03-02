import React from 'react';
import { TamaguiLogo } from '../Logo/TamaguiLogo';
import { setNextTintFamily } from '../Logo/tints';
import { useTint } from 'ui/src/hooks/useTint';
import type { ButtonProps } from 'tamagui';
import { Button, Image, Text, TooltipSimple } from 'tamagui';

export const SeasonToggleButton = (props: ButtonProps) => {
  const { name } = useTint();
  return (
    <TooltipSimple groupId="header-actions-season" label={`Mode: ${name}`}>
      <Button size="$3" w={38} onPress={setNextTintFamily} {...props} aria-label="Toggle theme">
        <Text>{[<TamaguiLogo key="tamagui" downscale={2.5} />, '🎅🏻'][name === 'tamagui' ? 0 : 1]}</Text>
      </Button>
    </TooltipSimple>
  );
};
