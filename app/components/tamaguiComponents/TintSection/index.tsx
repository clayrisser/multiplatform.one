// import { useOnIntersecting } from 'ui/src/tamagui/demos';
import { useOnIntersecting } from 'app/hooks/useOnIntersecting';
import { getTints } from '../Logo/tints';
import { useTint } from '../../../hooks/useTint';
import React, { useEffect, useMemo, useRef } from 'react';
import type { GetProps } from 'tamagui';
import { XStack, YStack, styled } from 'tamagui';

type Props = SectionProps & { themed?: boolean; index: number };

// not use its fixed size
const numIntersectingAtSection: number[] = getTints().tints.map((_) => 0);

export const TintSection = ({ children, index, themed, zIndex, ...props }: Props) => {
  const top = useRef<HTMLElement>(null);
  const bottom = useRef<HTMLElement>(null);
  const mid = useRef<HTMLElement>(null);
  const { tint, tints, setTintIndex } = useTint();

  useOnIntersecting(
    useMemo(() => [top, mid, bottom], []),
    (entries) => {
      const count = entries.reduce((a, b) => a + (b?.isIntersecting ? 1 : 0), 0);

      if (count < 2) {
        return;
      }

      numIntersectingAtSection[index] = count;

      let topIndex = -1;
      let topStr = -1;
      numIntersectingAtSection.forEach((str, index) => {
        if (str >= topStr) {
          topIndex = index;
          topStr = str;
        }
      });

      if (topIndex === index && topIndex !== current) {
        const tintIndex = topIndex <= 1 ? 3 : topIndex % tints.length;
        setTintIndex(tintIndex);
        current = index;
        listeners.forEach((cb) => cb(topIndex, count));
      }
    },
    {
      threshold: 0.1,
    },
  );

  return (
    <YStack zIndex={zIndex} position="relative">
      {useMemo(() => {
        return (
          <>
            <XStack ref={top} position="absolute" top="10%" left={0} right={0} height={10} opacity={0} pe="none" />
            <XStack ref={mid} position="absolute" top="50%" left={0} right={0} height={10} opacity={0} pe="none" />
            <XStack
              ref={bottom}
              position="absolute"
              bottom="10%"
              left={0}
              right={0}
              height={10}
              opacity={0}
              pe="none"
            />
          </>
        );
      }, [top, mid, bottom])}
      <HomeSection theme={(themed ? tint : null) as any} {...props}>
        {useMemo(() => children, [children])}
      </HomeSection>
    </YStack>
  );
};

let current = 0;
const listeners = new Set<Function>();

export const useTintSectionIndex = (cb: (index: number, str: number) => void) => {
  useEffect(() => {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  }, []);
};

export const HomeSection = styled(YStack, {
  name: 'Section',
  position: 'relative',
  paddingVertical: '$14',
  zIndex: 2,

  variants: {
    below: {
      true: {
        zIndex: 1,
      },
    },
  } as const,
});

type SectionProps = GetProps<typeof HomeSection>;

export const SectionTinted = ({ children, gradient, extraPad, bubble, noBorderTop, ...props }: any) => {
  const { tint } = useTint();
  const childrenMemo = useMemo(() => children, [children]);

  return (
    <YStack
      zIndex={2}
      contain="paint"
      position="relative"
      paddingVertical="$14"
      elevation="$2"
      {...(bubble && {
        maxWidth: 1400,
        borderRadius: '$6',
        borderWidth: 1,
        borderColor: `$${tint}4`,
        alignSelf: 'center',
        width: '100%',
      })}
      {...props}
    >
      <YStack
        fullscreen
        className="all ease-in ms1000"
        zIndex={-1}
        opacity={0.4}
        backgroundColor={gradient ? `$${tint}2` : null}
        {...(!bubble && {
          borderTopWidth: noBorderTop ? 0 : 1,
          borderBottomWidth: 1,
          borderColor: `$${tint}3`,
        })}
      />
      {childrenMemo}
    </YStack>
  );
};
