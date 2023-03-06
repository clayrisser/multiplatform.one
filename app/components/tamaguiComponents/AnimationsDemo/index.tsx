import { AnimationsDemo as AnimationsDemoBase } from '../demo/AnimationsDemo';
import { useTint } from 'app/hooks/useTint';
import React from 'react';

export const AnimationsDemo = (props) => {
  const { tint } = useTint();
  return <AnimationsDemoBase tint={tint} {...props} />;
};
