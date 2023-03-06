import React from 'react';
import { Paragraph, XStack, YStack } from 'tamagui';

const getBarColor = (name: string) => {
  switch (name) {
    case 'Tamagui (No Compiler)':
    case 'Tamagui':
      return '$pink9';
    case 'Stitches':
      return '$yellow9';
    case 'Stitches 0.1.9':
      return '$yellow4';
    case 'Styled Components':
    case 'SC':
      return '$red9';
    case 'react-native-web':
    case 'RN':
    case 'RNW':
    case 'React Native':
      return '$purple9';
    case 'Emotion':
      return '$green9';
    case 'Dripsy':
      return '$blue9';
    case 'NativeBase':
      return '$orange9';
    default:
      return 'gray';
  }
};

export function BenchmarkChart({ data, large, skipOthers = false, animateEnter = false }) {
  const maxValue = Math.max(...data.map((r) => r.value));

  return (
    <YStack space="$2" marginVertical="$4">
      {data.map((result, i) => {
        const width = `${Math.round((result.value / maxValue) * 100)}%`;
        return (
          <XStack space="$3" key={i}>
            <YStack width={large ? 120 : 70}>
              <Paragraph
                key={result.name}
                size="$2"
                whiteSpace="nowrap"
                textAlign="right"
                fontWeight={result.name === 'Tamagui' ? '700' : '400'}
              >
                {result.name}
              </Paragraph>
            </YStack>
            <XStack marginRight={65} flex={1} alignItems="center">
              <YStack
                backgroundColor={getBarColor(result.name)}
                opacity={result.name === 'Tamagui' ? 1 : skipOthers ? 1 : 1}
                width={width}
                height={20}
                borderRadius="$2"
                position="relative"
                justifyContent="center"
                scaleX={1}
                {...(animateEnter && {
                  animation: 'lazy',
                  enterStyle: {
                    opacity: 0,
                    scaleX: 0,
                  },
                })}
              >
                <Paragraph size="$1" whiteSpace="nowrap" position="absolute" right="$-2" x="100%">
                  {result.value}
                </Paragraph>
              </YStack>
            </XStack>
          </XStack>
        );
      })}
    </YStack>
  );
}
