import { AnimationsDemo as AnimationsDemoBase } from '@tamagui/demos';
import { useTint } from 'ui/src/hooks/useTint';
import React from 'react';

export const AnimationsDemo = (props) => {
  const { tint } = useTint();
  return <AnimationsDemoBase tint={tint} {...props} />;
};
