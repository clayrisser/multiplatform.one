import { AnimationsDemo as AnimationsDemoBase } from 'ui/src/demo/AnimationsDemo';
import { useTint } from '@multiplatform/ui/src/.hooks/useTint';
import React from 'react';

export const AnimationsDemo = (props) => {
  const { tint } = useTint();
  return <AnimationsDemoBase tint={tint} {...props} />;
};
