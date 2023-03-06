import React from 'react';
import { LogoIcon } from '../../Logo/TamaguiLogo';
import { Square } from 'tamagui';

export function AnimationsHoverDemo() {
  return (
    <Square
      borderColor="$pink10"
      animation="bouncy"
      elevation="$4"
      size={110}
      borderRadius="$9"
      hoverStyle={{
        scale: 1.2,
      }}
      pressStyle={{
        scale: 0.9,
      }}
    >
      <LogoIcon downscale={0.75} />
    </Square>
  );
}