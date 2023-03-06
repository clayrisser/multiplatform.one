import React from 'react';
import { YStack, Text } from 'tamagui';
import { useHoverGlow } from './index';

export default {
  title: 'app/tamaguiComponents/HoverGlow',
  component: useHoverGlow,
  parameters: { status: { type: 'beta' } },
};

export const main = () => {
  const { element, parentRef } = useHoverGlow({
    color: 'blue',
    background: 'white',
    opacity: 0.1,
    borderRadius: 10,
    blurPct: 10,
    strategy: 'radial-gradient',
  });
  return (
    <YStack ref={parentRef}>
      <Text>Hover over me</Text>
      {element}
    </YStack>
  );
};
