import { animations } from 'app/components/config/animations';
import { useIsIntersecting } from 'app/hooks/useOnIntersecting';
import { useTint } from 'app/hooks/useTint';
import { ArrowDown } from '@tamagui/lucide-icons';
import { NextLink } from '../NextLink';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Button, ListItem, Paragraph, Separator, XStack, YStack } from 'tamagui';

import { AnimationsDemo } from '../AnimationsDemo';
import { CodeDemoPreParsed } from '../CodeDemoPreParsed';
import { ContainerLarge } from '../Container';
import { HomeH2, HomeH3 } from '../HomeH2';

const animationDescriptions = [
  {
    name: 'Bouncy',
    description: 'A bouncy spring',
    animation: 'bouncy',
    settings: animations.animations.bouncy,
  },
  {
    name: 'Lazy',
    description: 'A lazy, straightforward spring',
    animation: 'lazy',
    settings: animations.animations.lazy,
  },
  {
    name: 'Quick',
    description: 'A super fast spring',
    animation: 'quick',
    settings: animations.animations.quick,
  },
] as const;

let hasScrolledOnce = false;

export function HeroExampleAnimations({ animationCode }) {
  const { tint } = useTint();
  const [disableScrollPane, setDisableScrollPane] = useState(true);

  return (
    <YStack>
      <ContainerLarge position="relative" space="$8">
        <YStack zIndex={1} space="$3">
          <HomeH2 position="relative">
            Universal <span className="rainbow clip-text">Animations</span>
          </HomeH2>
          <HomeH3>Better platform targeting with animation drivers that can be changed without changing code.</HomeH3>
        </YStack>

        <XStack>
          <YStack
            flex={2}
            minWidth="55%"
            alignSelf="center"
            marginRight="$-2"
            backgroundColor="$backgroundHover"
            zIndex={100}
            elevation="$4"
            borderRadius="$4"
            theme={tint as any}
          >
            <ExampleAnimations />
          </YStack>

          <YStack
            perspective={1000}
            rotateY="-5deg"
            x={-10}
            $sm={{ display: 'none' }}
            position="relative"
            borderRadius="$8"
            elevation="$5"
            overflow="hidden"
          >
            <YStack
              pointerEvents={disableScrollPane ? 'auto' : 'none'}
              opacity={disableScrollPane ? 1 : 0}
              fullscreen
              alignItems="center"
              justifyContent="center"
            >
              <YStack fullscreen top="60%" opacity={0.5} />
              <Button
                accessibilityLabel="View more"
                y={200}
                iconAfter={ArrowDown}
                size="$4"
                themeInverse
                zIndex={10}
                onPress={() => setDisableScrollPane(false)}
              >
                View more
              </Button>
            </YStack>

            <CodeDemoPreParsed
              pe={disableScrollPane ? 'none' : 'auto'}
              maxHeight={500}
              height={500}
              maxWidth={530}
              minWidth={530}
              borderRadius="$8"
              language="tsx"
              source={animationCode}
            />
          </YStack>
        </XStack>

        <XStack alignItems="center" space="$3">
          <NextLink href="/docs/core/animations#css">
            <Button accessibilityLabel="CSS docs" fontFamily="$silkscreen" theme={tint as any}>
              CSS &raquo;
            </Button>
          </NextLink>
          <NextLink href="/docs/core/animations#reanimated">
            <Button accessibilityLabel="Reanimated docs" fontFamily="$silkscreen">
              Reanimated &raquo;
            </Button>
          </NextLink>
          <NextLink href="/docs/core/animations">
            <Button accessibilityLabel="Animation docs" fontFamily="$silkscreen">
              Docs &raquo;
            </Button>
          </NextLink>
        </XStack>
      </ContainerLarge>
    </YStack>
  );
}

export const ExampleAnimations = memo(() => {
  const [animationI, setAnimationI] = useState(0);
  const animation = animationDescriptions[animationI];
  const container = useRef(null);
  const [positionI, setPositionI] = useState(2);
  const isIntersecting = useIsIntersecting(container);
  const next = (to = 1) => {
    setPositionI((x) => (x + to) % 3);
  };

  useEffect(() => {
    if (!isIntersecting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        next();
      }
      if (e.key === 'ArrowLeft') {
        next(-1);
      }
    };
    if (!hasScrolledOnce) {
      hasScrolledOnce = true;
      setTimeout(() => {
        // setting a long timeout extends the total render time a lot.., just slow down animation
        next();
      }, 250);
    }
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [isIntersecting]);

  const settings =
    typeof animation.settings === 'string' ? [['transition', animation.settings]] : Object.entries(animation.settings);

  return (
    <XStack
      borderWidth={1}
      borderColor="$borderColor"
      elevation="$1"
      width="100%"
      borderRadius="$4"
      overflow="hidden"
      height={305}
      alignSelf="center"
      x={0}
      flexDirection="row-reverse"
    >
      <YStack
        ref={container}
        position="relative"
        backgroundColor="$background"
        alignItems="center"
        justifyContent="center"
        width="60%"
        $sm={{ width: '100%' }}
      >
        {isIntersecting ? <AnimationsDemo position={positionI} animation={animation.animation} /> : null}
      </YStack>

      <Separator vertical />

      <YStack position="relative" $sm={{ display: 'none' }} width="40%">
        <YStack flex={1} theme="alt2" borderColor="$backgroundPress">
          {animationDescriptions.map((item, i) => {
            const isActive = item === animation;
            return (
              <ListItem
                key={item.name}
                {...(isActive && {
                  bc: '$backgroundHover',
                })}
                theme={isActive ? 'active' : 'alt2'}
                paddingHorizontal="$4"
                paddingVertical="$2"
                title={item.name}
                subTitle={item.description}
                cursor="pointer"
                hoverStyle={{
                  borderColor: '$backgroundHover',
                }}
                onPress={() => {
                  setAnimationI(i);
                  next();
                }}
              />
            );
          })}
        </YStack>

        <Separator />

        <XStack backgroundColor="$background" padding="$4" alignItems="center" justifyContent="center">
          {settings.map(([key, value]: any, i: number) => {
            if (key === 'type') {
              return null;
            }
            return (
              <React.Fragment key={key}>
                <YStack>
                  <Paragraph size="$2">{key}</Paragraph>
                  <Paragraph>{value}</Paragraph>
                </YStack>
                {i < settings.length - 1 && <Separator vertical marginHorizontal={15} />}
              </React.Fragment>
            );
          })}
        </XStack>
      </YStack>
    </XStack>
  );
});
