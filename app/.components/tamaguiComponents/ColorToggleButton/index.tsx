import React from 'react';
import { useTint } from '../../../hooks/useTint';
import type { ButtonProps } from 'tamagui';
import { Button, Circle, TooltipSimple } from 'tamagui';

export const ColorToggleButton = (props: ButtonProps) => {
  const { tint, setNextTint } = useTint();
  return (
    <TooltipSimple groupId="header-actions-color" label="Next theme">
      <Button size="$3" onPress={setNextTint} {...props} aria-label="Next theme">
        <Circle borderWidth={1} borderColor="var(--color9)" margin={2} size={12} backgroundColor={tint} />
      </Button>
    </TooltipSimple>
  );
};
