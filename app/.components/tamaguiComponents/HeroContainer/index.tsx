import { ThemeTint } from 'app/hooks/useTint';
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
      borderColor="$borderColor"
      borderWidth={0.5}
      marginTop="$4"
      marginBottom="$4"
      position="relative"
      display="flex"
      alignItems={alignItems || 'center'}
      justifyContent="center"
      paddingVertical={70}
      minHeight={300}
      y={0}
      borderRadius="$4"
      {...(noPad && {
        py: 0,
      })}
      $gtMd={{
        marginHorizontal: smaller ? 0 : '$-4',
      }}
    >
      <ErrorBoundary>
        {demoMultiple ? (
          <XStack maxHeight="100%" maxWidth="100%" justifyContent="flex-start">
            <XStack space="$3" paddingHorizontal="$8">
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
  alignItems: 'center',
  justifyContent: 'center',
  elevation: '$1',
  y: 0,
  overflow: 'hidden',
  minWidth: 180,
  backgroundColor: '$background',
  minHeight: 220,
  borderRadius: '$4',
});
