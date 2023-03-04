import { ThemeTint } from 'ui/src/hooks/useTint';
import React from 'react';
import { Theme, XStack, YStack, styled } from 'tamagui';

import { ErrorBoundary } from '../ErrorBoundary';

export function HeroContainer({
  children,
  demoMultiple,
  smaller,
  noPad,
  noScroll,
  alignItems,
  minimal,
  tinted,
}: {
  minimal?: boolean;
  demoMultiple?: boolean;
  children?: React.ReactNode;
  smaller?: boolean;
  noPad?: boolean;
  noScroll?: boolean;
  alignItems?: any;
  tinted?: boolean;
}) {
  const contents = (
    <YStack
      className={(minimal ? '' : 'hero-gradient') + (noScroll ? '' : ' hero-scroll')}
      boc="$borderColor"
      bw={0.5}
      mt="$4"
      mb="$4"
      position="relative"
      display="flex"
      alignItems={alignItems || 'center'}
      justifyContent="center"
      py={70}
      pos="relative"
      minHeight={300}
      y={0}
      borderRadius="$4"
      {...(noPad && {
        py: 0,
      })}
      $gtMd={{
        mx: smaller ? 0 : '$-4',
      }}
    >
      <ErrorBoundary>
        {demoMultiple ? (
          <XStack maxHeight="100%" maxWidth="100%" justifyContent="flex-start">
            <XStack space="$3" px="$8">
              <Theme reset>
                <Card>{children}</Card>
              </Theme>
              <Theme name="blue">
                <Card>{children}</Card>
              </Theme>
              <Theme name="red">
                <Card>{children}</Card>
              </Theme>
              <Theme name="pink">
                <Card>{children}</Card>
              </Theme>
              <Theme name="orange">
                <Card>{children}</Card>
              </Theme>
              <Theme name="green">
                <Card>{children}</Card>
              </Theme>
              <Theme name="yellow">
                <Card>{children}</Card>
              </Theme>
            </XStack>
          </XStack>
        ) : (
          children
        )}
      </ErrorBoundary>
    </YStack>
  );

  if (tinted) {
    return <ThemeTint>{contents}</ThemeTint>;
  }

  return contents;
}

const Card = styled(YStack, {
  ai: 'center',
  jc: 'center',
  elevation: '$1',
  y: 0,
  ov: 'hidden',
  minWidth: 180,
  bc: '$background',
  minHeight: 220,
  br: '$4',
});
