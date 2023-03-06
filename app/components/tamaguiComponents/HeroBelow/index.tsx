import React from 'react';
import { ThemeTint } from 'app/hooks/useTint';
import { ChevronRight, Code, Cpu, Layers } from '@tamagui/lucide-icons';
import { NextLink } from '../NextLink';
import { memo, useEffect, useRef } from 'react';
import type { YStackProps } from 'tamagui';
import { H3, Paragraph, XStack, YStack, debounce } from 'tamagui';

import { CodeInline } from '../Code';
import { ContainerLarge } from '../Container';
import { useHeroHovered } from '../HeroState';
import { IconStack } from '../IconStack';

const TitleLink = ({ href, children, ...props }: any) => {
  return (
    <NextLink href={href}>
      <H3 cursor="pointer" color="$color" my="$2">
        <CodeInline
          cursor="pointer"
          fontFamily="$silkscreen"
          bc="$color2"
          hoverStyle={{
            backgroundColor: '$color3',
          }}
          size="$9"
          fontSize="$7"
          ls={0}
          {...props}
        >
          {children} <ChevronRight size={12} />
        </CodeInline>
      </H3>
    </NextLink>
  );
};

export const HeroBelow = memo(() => {
  return (
    <YStack pos="relative" zi={1000} elevation="$4" py="$4" pt="$6" pb="$10">
      {/* <YStack fullscreen bc="$color3" zi={-1} o={0.33} /> */}
      <HeroBelowContent />
    </YStack>
  );
});

export const HeroBelowContent = memo(() => {
  const [hovered, setHovered] = useHeroHovered();

  const greenTheme = hovered === 0 ? 'green_alt1' : 'green';
  const blueTheme = hovered === 1 ? 'blue_alt1' : 'blue';
  const purpleTheme = hovered === 2 ? 'purple_alt1' : 'purple';

  return (
    <ContainerLarge>
      <XStack
        flex={1}
        overflow="hidden"
        maxWidth="100%"
        space="$8"
        flexWrap="nowrap"
        px="$2"
        mb={-8}
        py="$4"
        $sm={{ flexDirection: 'column' }}
        $gtSm={{
          px: '$6',
        }}
      >
        <Section theme={greenTheme} onHoverIn={() => setHovered(0)}>
          <IconStack>
            <Code size={16} color="var(--color9)" />
          </IconStack>
          <TitleLink href="/docs/core/configuration">Core</TitleLink>
          <Paragraph o={0.7} size="$4">
            Light design-system and style library for React Native + Web with themes, animations, responsive and pseudo
            styles, and much more.
          </Paragraph>
        </Section>

        <Section theme={blueTheme} onHoverIn={() => setHovered(1)}>
          <IconStack>
            <Cpu size={16} color="var(--color9)" />
          </IconStack>
          <TitleLink href="/docs/intro/why-a-compiler">Static</TitleLink>
          <Paragraph o={0.7} size="$4">
            Flatten your component tree with partial evaluation, outputs minimal CSS. Easy install with Next, Webpack,
            Vite, Babel and Metro.
          </Paragraph>
        </Section>

        <Section theme={purpleTheme} onHoverIn={() => setHovered(2)}>
          <IconStack>
            <Layers size={16} color="var(--color9)" />
          </IconStack>
          <TitleLink href="/docs/components/stacks">Tamagui</TitleLink>
          <Paragraph o={0.7} size="$4">
            A total UI kit for Native and Web. Composable components, themeable, sizable, adapts to each platform
            properly.
          </Paragraph>
        </Section>
      </XStack>
    </ContainerLarge>
  );
});

const Section = (props: YStackProps) => (
  <YStack width="33%" $sm={{ width: 'auto', maxWidth: 500, mx: 'auto' }} flexShrink={1} {...props} />
);
