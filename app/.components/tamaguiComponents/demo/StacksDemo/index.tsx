import React from 'react';
import { XStack, YStack, ZStack } from 'tamagui';

export function StacksDemo() {
  return (
    <XStack maxWidth={250} padding="$2" alignSelf="center" space>
      <YStack flex={1} space="$2" borderWidth={2} borderColor="$color" borderRadius="$4" padding="$2">
        <YStack backgroundColor="$color" borderRadius="$3" padding="$2" />
        <YStack backgroundColor="$color" borderRadius="$3" padding="$2" />
        <YStack backgroundColor="$color" borderRadius="$3" padding="$2" />
      </YStack>

      <XStack flex={1} space="$2" borderWidth={2} borderColor="$color" borderRadius="$4" padding="$2">
        <YStack backgroundColor="$color" borderRadius="$3" padding="$2" />
        <YStack backgroundColor="$color" borderRadius="$3" padding="$2" />
        <YStack backgroundColor="$color" borderRadius="$3" padding="$2" />
      </XStack>

      <ZStack maxWidth={50} maxHeight={85} width={100} flex={1}>
        <YStack fullscreen borderWidth={2} borderRadius="$4" padding="$2" />
        <YStack fullscreen y={10} x={10} bw={2} br="$4" p="$2" />
        <YStack fullscreen y={20} x={20} borderWidth={2} bacc="$color" br="$4" p="$2" />
      </ZStack>
    </XStack>
  );
}
