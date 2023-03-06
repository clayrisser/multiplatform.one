import React from 'react';
import { useTint } from 'app/hooks/useTint';
import { NextLink } from '../NextLink';
import { memo } from 'react';
import {
  Button,
  ButtonText,
  H1,
  Paragraph,
  Spacer,
  Text,
  Theme,
  VisuallyHidden,
  XStack,
  YStack,
  styled,
  useTheme,
} from 'tamagui';

import { ContainerLarge } from '../Container';
import { DiscordIcon } from '../DiscordIcon';
import { useHeroHovered } from '../HeroState';
import { InstallInput } from '../InstallInput';
import { TwitterIcon } from '../TwitterIcon';

// function useAlwaysConcurrent() {
//   const inputRef = useRef<HTMLInputElement>(null)

//   useEffect(() => {
//     const input = inputRef.current
//     if (!input) return
//     setInterval(() => {
//       console.log('writing in the input')
//       input.value = `${Math.random()}`
//     }, 16)
//   }, [inputRef])

//   return <input ref={inputRef} />
// }

export function Hero() {
  const { tint, name } = useTint();

  // const element = useAlwaysConcurrent()

  return (
    <Theme className={`${name}-season`} name={tint as any}>
      {/* {element} */}
      <YStack
        opacity={0.5}
        zIndex={-1}
        position="absolute"
        top={0}
        left={0}
        right={0}
        height={2000}
        className="hero-blur"
      />
      <HeroContents />
    </Theme>
  );
}

const HeroContents = memo(() => {
  const [hovered, setHovered] = useHeroHovered();

  return (
    <ContainerLarge contain="layout" position="relative">
      <YStack
        className="bg-grid mask-gradient-up"
        fullscreen
        top="auto"
        height={521}
        left={-1000}
        right={-1000}
        pointerEvents="none"
        opacity={0.08}
      />
      <YStack
        flex={1}
        overflow="hidden"
        space="$3"
        position="relative"
        paddingTop="$13"
        marginBottom="$4"
        $sm={{
          maxWidth: '100%',
          marginHorizontal: 'auto',
          paddingBottom: '$4',
        }}
      >
        <YStack alignItems="flex-start" $gtSm={{ alignItems: 'center' }} space="$2">
          <H1
            textAlign="left"
            size="$10"
            maxWidth={500}
            height={130}
            // FOR CLS IMPORTANT TO SET EXACT HEIGHT IDK WHY LINE HEIGHT SHOULD BE STABLE
            $gtSm={{
              marginHorizontal: 0,
              maxWidth: 800,
              size: '$13',
              height: 190,
              textAlign: 'center',
              alignSelf: 'center',
            }}
            $gtMd={{
              maxWidth: 900,
              size: '$14',
              height: 240,
            }}
            $gtLg={{
              size: '$16',
              lineHeight: '$15',
              maxWidth: 1200,
              height: 290,
            }}
          >
            <span className="all ease-in ms250 rainbow clip-text">Write less,</span>
            <br />
            runs&nbsp;faster.
          </H1>

          <YStack
            paddingHorizontal={0}
            maxWidth={420}
            // prevent layout shift
            height={70}
            $gtSm={{
              maxWidth: 500,
            }}
            $gtMd={{
              height: 90,
              padding: 90,
              maxWidth: 700,
            }}
            $gtLg={{
              maxWidth: 900,
            }}
          >
            <Subtitle>
              <NextLink href="/docs/core/configuration">
                <Tag theme="green_alt2" onHoverIn={() => setHovered(0)} active={hovered === 0}>
                  styles
                </Tag>
              </NextLink>
              ,{' '}
              <NextLink href="/docs/intro/why-a-compiler">
                <Tag theme="blue_alt2" onHoverIn={() => setHovered(1)} active={hovered === 1}>
                  optimizing compiler
                </Tag>
              </NextLink>{' '}
              &{' '}
              <NextLink href="/docs/components/stacks">
                <Tag theme="purple_alt2" onHoverIn={() => setHovered(2)} active={hovered === 2}>
                  UI&nbsp;kit
                </Tag>
              </NextLink>{' '}
              that&nbsp;unify&nbsp;React Native + Web
            </Subtitle>
          </YStack>
        </YStack>

        <Spacer size="$4" />
        <InstallInput />
        <Spacer size="$1" />

        <XStack alignItems="center" justifyContent="center" $xxs={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <NextLink target="_blank" href="https://twitter.com/tamagui_js">
            <YStack padding="$6" $sm={{ padding: '$3' }} opacity={0.65} hoverStyle={{ opacity: 1 }}>
              <VisuallyHidden>
                <Text>Twitter</Text>
              </VisuallyHidden>
              <TwitterIcon width={23} />
            </YStack>
          </NextLink>

          <XStack
            ai="center"
            jc="center"
            space="$2"
            $xs={{
              // words web-only
              // @ts-ignore
              order: '-1',
              mx: '50%',
            }}
          >
            <NextLink prefetch={false} href="/docs/intro/why-a-compiler">
              <Button
                // layout shifts...
                width={121}
                height={52}
                accessibilityLabel="Get started (docs)"
                fontFamily="$silkscreen"
                size="$5"
                borderRadius={1000}
                bordered
                borderWidth={2}
                marginHorizontal="$2"
                tabIndex="0"
                elevation="$2"
                pressStyle={{
                  elevation: '$0',
                }}
              >
                <ButtonText fontFamily="$silkscreen" size="$7" letterSpacing={1}>
                  How?
                </ButtonText>
              </Button>
            </NextLink>

            <NextLink prefetch={false} href="/docs/intro/introduction">
              <Button
                // layout shifts...
                width={118}
                height={52}
                accessibilityLabel="Get started (docs)"
                fontFamily="$silkscreen"
                size="$5"
                borderRadius={1000}
                bordered
                borderWidth={2}
                marginHorizontal="$2"
                tabIndex="0"
                elevation="$2"
                letterSpacing={-2}
                pressStyle={{
                  elevation: '$0',
                }}
              >
                <ButtonText fontFamily="$silkscreen" size="$7" letterSpacing={1}>
                  Docs
                </ButtonText>
              </Button>
            </NextLink>
          </XStack>

          <NextLink target="_blank" href="https://discord.gg/4qh6tdcVDa">
            <YStack padding="$6" $sm={{ padding: '$3' }} marginLeft="$-2" opacity={0.65} hoverStyle={{ opacity: 1 }}>
              <VisuallyHidden>
                <Text>Discord</Text>
              </VisuallyHidden>
              <DiscordIcon plain width={23} />
            </YStack>
          </NextLink>
        </XStack>
      </YStack>

      <Spacer size="$7" />
    </ContainerLarge>
  );
});

const Subtitle = styled(Paragraph, {
  color: '$gray10',
  size: '$6',
  fontFamily: '$silkscreen',
  textAlign: 'left',
  letterSpacing: -1,

  $gtSm: {
    textAlign: 'center',
    size: '$7',
  },

  $gtMd: {
    size: '$8',
  },

  $gtLg: {
    size: '$9',
    lineHeight: 50,
  },
});

const Tag = styled(Text, {
  className: 'hero-tag text-decoration-none',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  borderRadius: '$2',
  paddingHorizontal: '$1',
  marginHorizontal: '$-1',
  cursor: 'pointer',
  color: '$color10',
  backgroundColor: '$color2',

  hoverStyle: {
    color: '$color',
    backgroundColor: '$color3',
  },

  variants: {
    active: {
      true: {
        color: '$color10',
        bc: '$color5',

        hoverStyle: {
          color: '$color12',
          bc: '$color5',
        },
      },
    },
  },
});
