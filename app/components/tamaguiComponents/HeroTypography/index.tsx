import React from 'react';
import { AnimatePresence } from '@tamagui/animate-presence';
import { useIsIntersecting } from 'app/hooks/useOnIntersecting';
import { useTint } from 'app/hooks/useTint';
import { NextLink } from '../NextLink';
import { memo } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { Heading, TextProps } from 'tamagui';
import { Button, Card, H1, H2, H3, H4, H5, H6, Paragraph, Spacer, XStack, YStack, useDidFinishSSR } from 'tamagui';

import { ContainerLarge } from '../Container';
import { HomeH2 } from '../HomeH2';

const families = ['silkscreen', 'mono', 'heading'];

export const HeroTypography = memo(() => {
  const [family, setFamily] = useState(`silkscreen`);
  const ref = useRef<any>();
  const isIntersecting = useIsIntersecting(ref);

  useEffect(() => {
    if (!isIntersecting) {
      return;
    }
    const next = () => {
      setFamily((cur) => {
        return families[(families.indexOf(cur) + 1) % families.length];
      });
    };
    const tm = setInterval(next, 4200);
    next();
    return () => {
      clearInterval(tm);
    };
  }, [isIntersecting]);

  return (
    <>
      <YStack fullscreen className="" opacity={0.1} />
      {/* -5 my to fir grid nicely */}
      <ContainerLarge marginVertical={-5} position="relative" space="$8">
        <YStack ref={ref} alignItems="center" space="$3">
          <HomeH2>
            Beautifully expressive font systems with <span className="clip-text rainbow">rhythm</span>.
          </HomeH2>
        </YStack>

        <XStack
          alignItems="center"
          justifyContent="center"
          position="relative"
          space="$8"
          flexDirection="row-reverse"
          $sm={{
            flexDirection: 'column-reverse',
          }}
        >
          <OverlayCard />

          <YStack
            height={300}
            width="40%"
            space="$0.5"
            justifyContent="center"
            scale={1.1}
            x={-20}
            y={5}
            $sm={{ y: 0, minWidth: '110%', alignItems: 'center', x: 0, scale: 0.9 }}
          >
            <YStack alignItems="flex-end" contain="paint layout" height={270}>
              <AnimatePresence exitBeforeEnter>
                <AnimatedHeading key={`${family}1`} index={0} Component={H1} family={family} color="$pink10">
                  Swappable
                </AnimatedHeading>
                <AnimatedHeading key={`${family}2`} index={1} Component={H2} family={family} color="$blue10">
                  typed, compiled
                </AnimatedHeading>
                <AnimatedHeading key={`${family}3`} index={2} Component={H3} family={family} color="$purple10">
                  custom per-size
                </AnimatedHeading>
                <AnimatedHeading key={`${family}4`} index={3} Component={H4} family={family} color="$green10">
                  premade or custom
                </AnimatedHeading>
                <AnimatedHeading key={`${family}5`} index={4} Component={H5} family={family} color="$orange10">
                  easy to author
                </AnimatedHeading>
                <AnimatedHeading key={`${family}6`} index={5} Component={H6} family={family} color="$red10">
                  font themes
                </AnimatedHeading>
              </AnimatePresence>
            </YStack>
          </YStack>
        </XStack>
      </ContainerLarge>
    </>
  );
});

const OverlayCard = () => {
  const { tint } = useTint();

  // {/* TODO elevation not overriding? */}
  return (
    <Card borderWidth={1} borderColor="$borderColor" borderRadius="$6" elevation="$6" shadowRadius={60}>
      <YStack justifyContent="center" padding="$6" space="$5" maxWidth="calc(min(90vw, 400px))" $sm={{ padding: '$5' }}>
        <Paragraph textAlign="left" size="$8" fontWeight="400" letterSpacing={-1}>
          Use, swap and share fonts with typed vertical rhythm.
        </Paragraph>

        <Paragraph textAlign="left" size="$6" theme="alt2" fontWeight="400">
          Typed, sizable fonts with control over every facet - weight, spacing, line-height, letter-spacing, color and
          more.
        </Paragraph>

        <NextLink href="/docs/core/configuration">
          <Button accessibilityLabel="Fonts docs" fontFamily="$silkscreen" alignSelf="flex-end" theme={tint as any}>
            Fonts &raquo;
          </Button>
        </NextLink>
      </YStack>
    </Card>
  );
};

const AnimatedHeading = memo(
  ({
    Component,
    children,
    family,
    index,
    ...rest
  }: {
    family: string;
    Component: typeof Heading;
    children: any;
    index: number;
  } & TextProps) => {
    return (
      <Delay by={index * 180}>
        <Component
          animation="lazy"
          enterStyle={{ opacity: 0, y: -10 }}
          exitStyle={{ opacity: 0, y: 10 }}
          opacity={1}
          y={0}
          paddingRight="$1"
          marginVertical="$1"
          $sm={{
            paddingRight: 0,
          }}
          fontFamily={`$${family}`}
          textShadowColor="$shadowColorFocus"
          textShadowRadius={3}
          textShadowOffset={{ width: 0, height: 3 }}
          ellipse
          {...rest}
        >
          {children}
        </Component>
      </Delay>
    );
  },
);

const Delay = ({ children, by }) => {
  const isMounted = useDidFinishSSR();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setDone(true), by);
    return () => clearTimeout(showTimer);
  });

  return !isMounted || !done ? null : children;
};
