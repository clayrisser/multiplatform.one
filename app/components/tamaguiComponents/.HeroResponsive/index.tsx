import { throttle } from '@github/mini-throttle';
import { demoMedia } from '../../../components/config/media';
import { useOnIntersecting } from '../../../../app/hooks/useOnIntersecting';
import { useTint } from '../../../hooks/useTint';
import { ChevronLeft, ChevronRight, Lock, MapPin, Monitor, Star } from '@tamagui/lucide-icons';
import React, { startTransition, useMemo } from 'react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Circle,
  H3,
  H4,
  H5,
  Image,
  Paragraph,
  Spacer,
  Theme,
  XStack,
  YStack,
  YStackProps,
  isTouchable,
  useDebounce,
  useDidFinishSSR,
  useGet,
  useIsomorphicLayoutEffect,
  useMedia,
} from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

// import favicon from '../public/favicon.svg';
import { Container, ContainerLarge } from '../Container';
import { HomeH2, HomeH3 } from '../HomeH2';

const breakpoints = [
  { name: 'xs', at: demoMedia[0] },
  { name: 'sm', at: demoMedia[1] },
  { name: 'md', at: demoMedia[2] },
  { name: 'lg', at: demoMedia[3] },
];
const browserHeight = 485;

const IS_SAFARI = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const useIsSafari = () => {
  const ssrDone = useDidFinishSSR();
  return ssrDone ? IS_SAFARI : false;
};

export const HeroResponsive = memo(() => {
  const [bounding, setBounding] = useState<DOMRect | null>(null);
  const prevMove = useRef(0);
  const initialWidth = 420;
  const [isDragging, setIsDragging] = useState(false);
  const [move, setMove] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const safariRef = useRef<HTMLElement | null>(null);
  const getState = useGet({ move, isDragging, bounding });
  const [sizeI, setSizeI] = useState(0);
  // safari drags slower so lets pre-load iframe
  const [hasInteracted, setHasInteracted] = useState(false);
  const updateBoundings = useDebounce(() => {
    const rect = safariRef.current?.getBoundingClientRect() ?? null;
    startTransition(() => {
      setBounding(rect);
    });
  }, 350);

  const isSafari = useIsSafari();

  useEffect(() => {
    if (isSafari) {
      setHasInteracted(true);
    }
  }, [isSafari]);

  useIsomorphicLayoutEffect(() => {
    if (!bounding) {
      updateBoundings();
      return;
    }
    const width = bounding.width + move - 10;
    for (let i = breakpoints.length - 1; i >= 0; i--) {
      if (width > breakpoints[i].at) {
        setSizeI(i + 1);
        return;
      }
    }
  }, [move, bounding]);

  useEffect(() => {
    window.addEventListener('resize', updateBoundings);
    return () => {
      window.removeEventListener('resize', updateBoundings);
    };
  }, []);

  const onMove = throttle((e: MouseEvent) => {
    const state = getState();
    if (!state.isDragging) return;
    if (!state.bounding) {
      updateBoundings();
      return;
    }
    if (!state.bounding) return;
    setHasInteracted(true);
    const right = state.bounding.width + state.bounding.x;
    const x = e.pageX - right;
    const maxMove = breakpoints[breakpoints.length - 1].at - initialWidth + 120;
    const nextMove = Math.min(maxMove, Math.max(0, x));
    const next = nextMove + (prevMove.current || 0);

    setMove(next);

    prevMove.current = 0;
  }, 24);

  const stop = () => {
    prevMove.current = getState().move;
    setIsDragging(false);
  };

  useOnIntersecting(
    ref,
    ([entry], didResize) => {
      if (!entry?.isIntersecting) return;
      const node = safariRef.current;
      if (!node) return;
      if (didResize) {
        updateBoundings();
      }
      prevMove.current = getState().move - 10;
      window.addEventListener('pointermove', onMove);
      return () => {
        onMove.cancel();
        window.removeEventListener('pointermove', onMove);
        stop();
      };
    },
    {
      threshold: 0.01,
    },
  );

  useEffect(() => {
    window.addEventListener('mouseup', stop);
    window.addEventListener('blur', stop);
    return () => {
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('blur', stop);
    };
  }, []);

  const media = useMedia();
  const [smIndex, setSmIndex] = useState(0);
  const [width, setWidth] = useState(initialWidth);
  const isSmall = initialWidth + Math.max(0, move) < 680;

  const nextWidth = media.sm ? breakpoints[smIndex].at : initialWidth + Math.max(0, move);
  // ssr compat stay in effect
  useIsomorphicLayoutEffect(() => {
    if (width !== nextWidth) {
      setWidth(nextWidth);
    }
  }, [nextWidth]);

  const handleMarkerPress = useCallback((name) => {
    setHasInteracted(true);
    const next = (breakpoints.find((x) => x.name === name)?.at ?? 0) - initialWidth + 20;
    setMove(next);
    prevMove.current = 0;
  }, []);

  const scale = 0.7 - smIndex * 0.05;

  return (
    <YStack ref={ref} y={0} marginTop={-80} position="relative">
      <ContainerLarge position="relative">
        <ResponsiveHeader />
        {/* <Spacer size="$6" $sm={{ size: '$0' }} /> */}
        <YStack height={browserHeight + 80} />
        <XStack
          bottom={-20}
          position="absolute"
          zIndex={1}
          flex={1}
          space="$1"
          // mostly keeping this to make sure we get a good ACID test of useMedia().sm
          {...(media.sm && {
            scale,
            x: 150 - width / 2 - (smIndex ? (0.68 - scale) * 920 : 0),
            y: -40,
          })}
        >
          <YStack
            zIndex={2}
            className="unselectable"
            contain="paint layout"
            pointerEvents={isDragging ? 'none' : 'auto'}
            width={width}
            flex={1}
            ref={safariRef}
            onPress={() => {
              if (isTouchable) {
                setHasInteracted(true);
                setSmIndex((i) => (i + 1) % breakpoints.length);
              }
            }}
          >
            <Safari shouldLoad={hasInteracted} isSmall={isSmall} />
          </YStack>

          <Container zIndex={1} position="absolute">
            <XStack x={-10} $sm={{ display: 'none' }}>
              {breakpoints.map((bp, i) => {
                return (
                  <Marker
                    key={i}
                    onPress={handleMarkerPress}
                    active={i === 0 ? true : sizeI > i}
                    name={breakpoints[i].name}
                    l={breakpoints[i].at}
                  />
                );
              })}
            </XStack>
          </Container>

          {!isSafari && (
            <YStack
              justifyContent="center"
              cursor="ew-resize"
              onPressIn={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              $sm={{
                display: 'none',
              }}
            >
              <YStack
                backgroundColor="$color"
                opacity={0.35}
                hoverStyle={{ opacity: 0.4 }}
                borderRadius="$8"
                width={8}
                height={134}
              />
            </YStack>
          )}
        </XStack>

        <YStack
          position="absolute"
          zIndex={0}
          height={browserHeight + 120}
          left={-1000}
          right={-1000}
          bottom={-75}
          alignItems="center"
          justifyContent="center"
        >
          <XStack
            position="absolute"
            top={0}
            left={0}
            right={0}
            borderBottomWidth={1}
            borderColor="$color"
            opacity={0.1}
          />
          <YStack position="relative" flex={1} height="100%" width="100%">
            <YStack fullscreen className="mask-gradient-down" zIndex={-1}>
              <YStack fullscreen bottom="auto" height={439} className="bg-grid" />
            </YStack>
          </YStack>
        </YStack>
      </ContainerLarge>
    </YStack>
  );
});

const Marker = memo(({ name, active, onPress, ...props }: any) => {
  return (
    <YStack className="unselectable" theme={active ? 'pink' : null} pos="absolute" {...props}>
      <XStack y={-60} alignItems="flex-start">
        <YStack width={1} height={70} borderColor="$colorHover" opacity={active ? 0.2 : 0.05} />
        <Button
          accessibilityLabel={`Responsive size ${name}`}
          borderWidth={1}
          size="$3"
          circular
          position="absolute"
          top={0}
          left={0}
          y={-20}
          x={-17}
          fontSize={12}
          onPress={() => {
            onPress(name);
          }}
        >
          {name}
        </Button>
      </XStack>
    </YStack>
  );
});

const ResponsiveHeader = memo(() => {
  return (
    <YStack flex={1} space="$3">
      <XStack>
        <HomeH2 textAlign="left" alignSelf="flex-start">
          Easily responsive
        </HomeH2>
      </XStack>

      <HomeH3 textAlign="left" alignSelf="flex-start" padding={0} maxWidth={450} theme="alt2">
        Responsive props and hooks, compiled to atomic CSS on web.
      </HomeH3>
    </YStack>
  );
});

const SafariFrame = ({ children, ...props }: YStackProps) => {
  const { tint } = useTint();
  return (
    <YStack
      theme={tint as any}
      className="unselectable"
      contain="paint layout"
      elevation="$6"
      flex={1}
      overflow="hidden"
      borderRadius="$4"
      borderColor="$borderColor"
      borderWidth={1}
      width="99%"
      {...props}
    >
      {useMemo(() => children, [children])}
    </YStack>
  );
};

export const Safari = memo(({ isSmall, shouldLoad }: { isSmall?: boolean; shouldLoad?: boolean }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <SafariFrame>
      <YStack
        borderColor="$background"
        paddingHorizontal="$4"
        justifyContent="center"
        borderBottomWidth={0}
        height={50}
      >
        <XStack position="relative" alignItems="center" space="$4">
          <XStack space="$2">
            <Circle borderColor="$red10" size={10} />
            <Circle borderColor="$yellow10" size={10} />
            <Circle borderColor="$green10" size={10} />
          </XStack>

          {!isSmall && (
            <XStack space="$1">
              <ChevronLeft size={20} color="var(--color)" opacity={0.25} />
              <ChevronRight size={20} color="var(--color)" opacity={0.25} />
            </XStack>
          )}

          <XStack fullscreen alignItems="center">
            <XStack flex={1} />
            <XStack
              height={30}
              flex={2}
              borderRadius="$2"
              borderWidth={1}
              borderColor="$borderColor"
              backgroundColor="$backgroundPress"
              alignItems="center"
              paddingHorizontal="$2"
              justifyContent="center"
              space
            >
              <Lock color="var(--colorPress)" size={12} />
              <Paragraph theme="alt1" size="$2">
                tamagui.dev
              </Paragraph>
            </XStack>
            <XStack flex={1} />
          </XStack>
        </XStack>
      </YStack>

      <XStack backgroundColor="$background" marginHorizontal={-2}>
        <Tab backgroundColor="var(--green7)" btlr={0}>
          Github
        </Tab>
        <Tab backgroundColor="var(--pink7)" active>
          Tamagui - React Native & Web UI kits
        </Tab>
        <Tab backgroundColor="var(--yellow7)" btrr={0}>
          @natebirdman
        </Tab>
      </XStack>

      <YStack position="relative" backgroundColor="$color1" height={browserHeight}>
        <YStack height="100%" pointerEvents="none">
          {shouldLoad && (
            <YStack fullscreen contain="paint" opacity={isLoaded ? 1 : 0} backgroundColor="$background" zIndex={10}>
              <iframe
                title="Responsive demo"
                style={{
                  backgroundColor: 'transparent',
                }}
                onLoad={() => {
                  setTimeout(() => {
                    setIsLoaded(true);
                  }, 100);
                }}
                width="100%"
                height={browserHeight}
                src="/responsive-demo"
              />
            </YStack>
          )}

          <YStack zIndex={0} fullscreen padding="$4">
            <XStack alignItems="center" justifyContent="center" position="relative" borderRadius="$6" overflow="hidden">
              <YStack width={800} height={200}>
                <LinearGradient opacity={0.1} fullscreen colors={['$yellow10', '$green10']} />
              </YStack>
              <YStack padding="$4" position="absolute" fullscreen flex={1}>
                <YStack flex={1} />
                <XStack>
                  <YStack flex={1}>
                    <H3>Enchanting Garden</H3>
                    <XStack alignItems="center" space>
                      <MapPin size={12} color="var(--color)" />
                      <H5>Kailua, HI</H5>
                    </XStack>
                  </YStack>
                  <YStack alignItems="flex-end">
                    <H4>$45</H4>
                    <Paragraph>/night</Paragraph>
                  </YStack>
                </XStack>
              </YStack>
            </XStack>

            <Spacer />

            <YStack paddingHorizontal="$4">
              <XStack>
                <XStack alignItems="center" space>
                  <Paragraph theme="alt2">4 guests</Paragraph>
                  <Paragraph theme="alt2">&middot;</Paragraph>
                  <Paragraph theme="alt2">Entire house</Paragraph>
                </XStack>
                <Spacer flex={1} />
                <XStack alignItems="center" space>
                  <Star size={20} color="var(--purple10)" />
                  <Paragraph theme="purple_alt2">4.55</Paragraph>
                </XStack>
              </XStack>

              <Spacer />

              <Paragraph theme="alt1" size="$4">
                A lovely, private and very clean cottage with all amenities for a comfortable and peaceful stay. We are
                a 20 minute walk from the Hawaii Tropical Botanical Garden and well situated for touring to Akaka Falls,
                Volcano National Park, and many other destinations.
              </Paragraph>
            </YStack>
          </YStack>
        </YStack>
      </YStack>
    </SafariFrame>
  );
});

const Tab = memo(({ active, children, bc, ...props }: any) => {
  return (
    <Theme name={active ? null : 'alt1'}>
      <XStack
        borderTopWidth={1}
        borderColor={active ? 'transparent' : '$borderColor'}
        width="33.33%"
        borderLeftWidth={1}
        borderRightWidth={1}
        borderBottomWidth={1}
        borderBottomColor={active ? '$borderColor' : 'transparent'}
        borderTopLeftRadius={active ? 0 : 4}
        borderTopRightRadius={active ? 0 : 4}
        backgroundColor="$background"
        overflow="hidden"
        flex={1}
        paddingVertical="$1"
        paddingHorizontal="$2"
        alignItems="center"
        justifyContent="center"
        {...props}
      >
        <Circle size={16} backgroundColor={bc}>
          <Image width={12} height={12} src={favicon.src} />
        </Circle>
        <Spacer size="$2" />
        <Paragraph opacity={active ? 1 : 0.5} cursor="default" size="$1" ellipse>
          {children}
        </Paragraph>
      </XStack>
    </Theme>
  );
});
