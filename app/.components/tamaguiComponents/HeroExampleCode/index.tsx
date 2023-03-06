import React from 'react';
import { ThemeTint, useTint } from 'app/hooks/useTint';
import { FastForward } from '@tamagui/lucide-icons';
import { memo, useState } from 'react';
import { Button, H5, Paragraph, ScrollView, ThemeName, XGroup, XStack, YStack } from 'tamagui';
import { CodeDemoPreParsed } from '../CodeDemoPreParsed';
import { ContainerLarge } from '../Container';
import { HomeH2, HomeH3 } from '../HomeH2';
import { IconStack } from '../IconStack';

export function HeroExampleCode({ examples, onlyDemo }: { examples: any; onlyDemo?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeExample = examples[activeIndex];
  const subtitles = [
    'SSR-first atomic CSS',
    'eliminating inline style logic',
    'flattening your component tree',
    'removing dead code entirely',
  ];

  return (
    <ContainerLarge position="relative">
      <YStack zIndex={1} space="$6" marginBottom="$4">
        {!onlyDemo && (
          <YStack alignItems="center" space="$3">
            <HomeH2>A better style system</HomeH2>
            <HomeH3 alignItems="center" justifyContent="center">
              A multi-faceted optimizing compiler enables
              <br />
              <strong>{subtitles[activeIndex]}</strong>.
            </HomeH3>
          </YStack>
        )}

        <ThemeTint>
          <XGroup
            scrollable
            bordered
            backgroundColor="$color2"
            chromeless
            maxWidth="100%"
            alignSelf="center"
            overflow="hidden"
            {...(onlyDemo && {
              mt: '$-6',
            })}
          >
            {examples.map((example, i) => {
              return (
                <Button
                  accessibilityLabel="See example"
                  onPress={() => setActiveIndex(i)}
                  theme={i === activeIndex ? 'active' : null}
                  chromeless={i !== activeIndex}
                  key={i}
                  borderRadius={0}
                  size="$3"
                  fontFamily="$silkscreen"
                >
                  {example.name}
                </Button>
              );
            })}
          </XGroup>
        </ThemeTint>

        <XStack
          position="relative"
          justifyContent="space-between"
          $sm={{ flexDirection: 'column' }}
          {...(onlyDemo && {
            fd: 'column',
          })}
        >
          <YStack
            key={`input${activeIndex}`}
            flex={1}
            maxWidth="50%"
            {...(onlyDemo && { maxWidth: '100%' })}
            $sm={{ maxWidth: '100%' }}
            paddingHorizontal="$2"
            space
          >
            <Paragraph
              maxWidth={480}
              alignSelf="center"
              size="$5"
              minHeight={50}
              textAlign="center"
              paddingHorizontal="$6"
            >
              <span style={{ opacity: 0.65 }}>{activeExample.input.description}</span>
            </Paragraph>
            <CodeExamples title="Input" {...activeExample.input} />
          </YStack>

          <YStack
            $sm={{ display: 'none' }}
            {...(onlyDemo && { display: 'none' })}
            position="absolute"
            left={0}
            right={0}
            alignItems="center"
            justifyContent="center"
            top={95}
            theme="alt2"
            zIndex={1000}
            pointerEvents="none"
          >
            <IconStack alignSelf="center" padding="$3" marginBottom={0}>
              <FastForward color="var(--colorHover)" size={22} />
            </IconStack>
          </YStack>
          <YStack
            key={`output${activeIndex}`}
            flex={1}
            maxWidth="50%"
            {...(onlyDemo && { maxWidth: '100%', mt: '$6' })}
            $sm={{ maxWidth: '100%', marginTop: '$6' }}
            paddingHorizontal="$2"
            space
          >
            <Paragraph
              maxWidth={480}
              alignSelf="center"
              size="$5"
              minHeight={50}
              textAlign="center"
              paddingHorizontal="$6"
            >
              <span style={{ opacity: 0.65 }}>{activeExample.output.description}</span>
            </Paragraph>
            <CodeExamples title="Output" {...activeExample.output} />
          </YStack>
        </XStack>
      </YStack>
    </ContainerLarge>
  );
}

const CodeExamples = memo(({ examples, title }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const example = examples[activeIndex];
  const { tint } = useTint();

  return (
    <YStack overflow="hidden" flex={1}>
      <YStack>
        <ScrollView
          alignSelf="center"
          alignItems="center"
          zIndex={10}
          horizontal
          showsHorizontalScrollIndicator={false}
          marginBottom="$-2"
          maxWidth="100%"
        >
          <XStack paddingHorizontal="$4" flexShrink={0} space>
            <XGroup size="$2" bordered>
              <Button disabled size="$2" fontSize="$4" paddingHorizontal="$4">
                {title}
              </Button>
            </XGroup>
            <XGroup size="$2" bordered>
              {examples.map((example, i) => (
                <Button
                  accessibilityLabel="See example"
                  onPress={() => setActiveIndex(i)}
                  theme={i === activeIndex ? (tint as any) : 'alt1'}
                  size="$2"
                  key={i}
                  borderRadius="$0"
                >
                  {example.name}
                </Button>
              ))}
            </XGroup>
          </XStack>
        </ScrollView>
      </YStack>
      <XStack maxWidth="100%" flex={1}>
        <YStack flex={1} maxWidth="100%" opacity={0.9} hoverStyle={{ opacity: 1 }}>
          <CodeDemoPreParsed height={325} maxHeight={325} f={1} language={example.language} source={example.code} />
        </YStack>
      </XStack>
    </YStack>
  );
});
