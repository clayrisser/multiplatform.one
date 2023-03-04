import React from 'react';
import { LogoIcon } from '../../Logo/TamaguiLogo';
import { useRef, useState } from 'react';
import { Button, Square, YStack } from 'tamagui';
import { useIsIntersecting } from '../../../../hooks/useOnIntersecting';

export function AnimationsEnterDemo(props: any) {
  const ref = useRef<HTMLElement>(null);
  const hasIntersected = useIsIntersecting(ref, { once: true });
  const [key, setKey] = useState(0);

  if (!hasIntersected) {
    return <YStack ref={ref} />;
  }

  return (
    <>
      <Square
        key={key}
        enterStyle={{
          scale: 1.5,
          y: -10,
          opacity: 0,
        }}
        animation="bouncy"
        elevation="$4"
        size={110}
        opacity={1}
        scale={1}
        y={0}
        backgroundColor="$pink10"
        borderRadius="$9"
      >
        {props.children ?? <LogoIcon downscale={0.75} />}
      </Square>

      <Button size="$3" marginTop="$4" onPress={() => setKey(Math.random())}>
        Re-mount
      </Button>
    </>
  );
}
