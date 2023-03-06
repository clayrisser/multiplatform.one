import React from 'react';
import { TamaguiLogo } from '../Logo/TamaguiLogo';
import { setNextTintFamily } from '../Logo/tints';
import { useTint } from 'app/hooks/useTint';
import type { ButtonProps } from 'tamagui';
import { Button, Text, TooltipSimple } from 'tamagui';

export const SeasonToggleButton = (props: ButtonProps) => {
  const { name } = useTint();
  return (
    <TooltipSimple groupId="header-actions-season" label={`Mode: ${name}`}>
      <Button size="$3" width={38} onPress={setNextTintFamily} {...props} aria-label="Toggle theme">
        <Text>{[<TamaguiLogo key="tamagui" downscale={2.5} />, '🎅🏻'][name === 'tamagui' ? 0 : 1]}</Text>
      </Button>
    </TooltipSimple>
  );
};
