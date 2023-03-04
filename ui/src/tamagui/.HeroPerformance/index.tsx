import React from 'react';
import { useOnIntersecting } from '@tamagui/demos';
import { useTint } from '../../hooks/useTint';
import { NextLink } from '../NextLink';
import { useRef, useState } from 'react';
import { Button, Paragraph, XStack, YStack } from 'tamagui';

import { ContainerLarge } from '../Container';
import { HomeH2, HomeH3 } from '../HomeH2';
import { BenchmarkChartWeb } from '../BenchmarkChartWeb';

export function HeroPerformance() {
  const ref = useRef<HTMLElement>(null);
  const [show, setShow] = useState(false);

  useOnIntersecting(ref, ([entry]) => {
    if (entry?.isIntersecting) {
      setTimeout(() => {
        setShow(true);
      }, 800);
    }
  });

  return (
    <ContainerLarge position="relative">
      <YStack alignItems="center" zIndex={1} space="$4">
        <YStack alignItems="center" space="$2">
          <HomeH2 size="$10" maxWidth={500} ref={ref}>
            Automatically fast
          </HomeH2>
          <HomeH3>Partial evaluation, tree flattening, hoisting and dead-code&nbsp;elimination&nbsp;✅</HomeH3>
        </YStack>

        <YStack
          position="relative"
          paddingHorizontal="$2"
          $sm={{ paddingHorizontal: '$0', marginHorizontal: -20, width: 'calc(100% + 40px)' }}
          height={131}
          borderRadius="$8"
          width="100%"
          alignItems="stretch"
          justifyContent="center"
        >
          <Paragraph
            position="absolute"
            bottom={-20}
            right={20}
            marginTop={-20}
            theme="alt2"
            size="$2"
            $sm={{ display: 'none' }}
          >
            Lower is better. As of February 2022.
          </Paragraph>

          {show && <BenchmarkChartWeb />}
        </YStack>

        <XStack space flexWrap="wrap">
          <BenchmarksLink />
          <CompilerLink />
        </XStack>
      </YStack>
    </ContainerLarge>
  );
}

const BenchmarksLink = () => {
  const { tint } = useTint();
  return (
    <NextLink href="/docs/intro/benchmarks">
      <Button accessibilityLabel="Performance benchmarks" fontFamily="$silkscreen" theme={tint as any}>
        Benchmarks &raquo;
      </Button>
    </NextLink>
  );
};

const CompilerLink = () => {
  const { tint } = useTint();
  return (
    <NextLink href="/docs/intro/why-a-compiler">
      <Button accessibilityLabel="Compiler" fontFamily="$silkscreen" theme={tint as any}>
        About &raquo;
      </Button>
    </NextLink>
  );
};
