import React from 'react';
import { useTint } from 'ui/src/hooks/useTint';
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
import { useHeroHovered } from '../heroState';
import { InstallInput } from './InstallInput';
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
      <YStack o={0.5} zi={-1} pos="absolute" t={0} l={0} r={0} h={2000} className="hero-blur" />
      <HeroContents />
    </Theme>
  );
}

const HeroContents = memo(() => {
  const [hovered, setHovered] = useHeroHovered();

  return (
    <ContainerLarge contain="layout" pos="relative">
      <YStack
        className="bg-grid mask-gradient-up"
        fullscreen
        top="auto"
        height={521}
        left={-1000}
        right={-1000}
        pe="none"
        o={0.08}
      />
      <YStack
        f={1}
        ov="hidden"
        space="$3"
        position="relative"
        pt="$13"
        mb="$4"
        $sm={{
          maxWidth: '100%',
          mx: 'auto',
          pb: '$4',
        }}
      >
        <YStack ai="flex-start" $gtSm={{ ai: 'center' }} space="$2">
          <H1
            ta="left"
            size="$10"
            maw={500}
            h={130}
            // FOR CLS IMPORTANT TO SET EXACT HEIGHT IDK WHY LINE HEIGHT SHOULD BE STABLE
            $gtSm={{
              mx: 0,
              maxWidth: 800,
              size: '$13',
              h: 190,
              ta: 'center',
              als: 'center',
            }}
            $gtMd={{
              maxWidth: 900,
              size: '$14',
              h: 240,
            }}
            $gtLg={{
              size: '$16',
              lh: '$15',
              maxWidth: 1200,
              h: 290,
            }}
          >
            <span className="all ease-in ms250 rainbow clip-text">Write less,</span>
            <br />
            runs&nbsp;faster.
          </H1>

          <YStack
            px={0}
            maw={420}
            // prevent layout shift
            h={70}
            $gtSm={{
              maw: 500,
            }}
            $gtMd={{
              h: 90,
              px: 90,
              maw: 700,
            }}
            $gtLg={{
              maw: 900,
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

        <XStack ai="center" jc="center" $xxs={{ ai: 'center', fw: 'wrap' }}>
          <NextLink target="_blank" href="https://twitter.com/tamagui_js">
            <YStack p="$6" $sm={{ p: '$3' }} opacity={0.65} hoverStyle={{ opacity: 1 }}>
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
            $xxs={{
              // words web-only
              // @ts-ignore
              order: '-1',
              mx: '50%',
            }}
          >
            <NextLink prefetch={false} href="/docs/intro/why-a-compiler">
              <Button
                // layout shifts...
                w={121}
                h={52}
                accessibilityLabel="Get started (docs)"
                fontFamily="$silkscreen"
                size="$5"
                borderRadius={1000}
                bordered
                bw={2}
                mx="$2"
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
                w={118}
                h={52}
                accessibilityLabel="Get started (docs)"
                fontFamily="$silkscreen"
                size="$5"
                borderRadius={1000}
                bordered
                bw={2}
                mx="$2"
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
            <YStack p="$6" $sm={{ p: '$3' }} ml="$-2" opacity={0.65} hoverStyle={{ opacity: 1 }}>
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
  ta: 'left',
  ls: -1,

  $gtSm: {
    ta: 'center',
    size: '$7',
  },

  $gtMd: {
    size: '$8',
  },

  $gtLg: {
    size: '$9',
    lh: 50,
  },
});

const Tag = styled(Text, {
  className: 'hero-tag text-decoration-none',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  borderRadius: '$2',
  px: '$1',
  mx: '$-1',
  cursor: 'pointer',
  color: '$color10',
  bc: '$color2',

  hoverStyle: {
    color: '$color',
    bc: '$color3',
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
