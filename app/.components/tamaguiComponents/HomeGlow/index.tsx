/* eslint-disable spellcheck/spell-checker */
/* eslint-disable eqeqeq */
import React from 'react';
import { useTint } from 'ui/src/hooks/useTint';
import { memo, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import type { ThemeName } from 'tamagui';
import { YStack, isClient, useDebounce } from 'tamagui';

import { useTintSectionIndex } from '../TintSection';

export const HomeGlow = memo(() => {
  const { tints, tint, name, tintIndex } = useTint();
  const isHeroBelowColor = tint === 'blue' || tint === 'green' || tint === 'purple';
  const [index, setIndex] = useState(0);
  const isAtTop = index <= 1;
  const isOnHeroBelow = isAtTop && isHeroBelowColor;
  const [scrollTop, setScrollTopRaw] = useState(0);
  const setScrollTop = useDebounce(setScrollTopRaw, 200);
  const windowWidth = Dimensions.get('window').width;
  const xs = Math.min(400, windowWidth * 0.25);
  const scale = isOnHeroBelow ? 0.5 : 1;

  if (isClient) {
    useTintSectionIndex((index) => {
      setIndex(index);
      const sy = document.documentElement?.scrollTop ?? 0;
      setScrollTop(sy + 100);
    });
  }

  const glows = useMemo(() => {
    return (
      <>
        {tints.map((cur, i) => {
          const isDouble = name === 'xmas';
          const active = isDouble ? i == 0 || i == 1 : cur === tint;
          const isOpposite = isDouble && cur === 'green' && tint !== cur;
          return (
            <YStack
              key={`${cur}${i}`}
              overflow="hidden"
              height="100vh"
              width={1000}
              theme={cur as ThemeName}
              opacity={active ? 0.3 : 0}
              fullscreen
              left="calc(50vw - 500px)"
              x={isOnHeroBelow ? 0 : isDouble ? (isOpposite ? -500 : 500) : 0}
              scale={scale}
              className="hero-blur"
            />
          );
        })}
      </>
    );
  }, [scale, tint, tints]);

  return (
    <YStack
      position="absolute"
      top={0}
      left={0}
      contain="layout"
      pe="none"
      animation="quick"
      key={0}
      zIndex={-1}
      x={0}
      y={scrollTop}
      {...(isOnHeroBelow && {
        animation: 'quick',
        x: tintIndex === 2 ? -xs : tintIndex === 4 ? xs : 0,
        y: 300,
      })}
      // display={isResizing ? 'none' : 'flex'}
    >
      {glows}
    </YStack>
  );
});
