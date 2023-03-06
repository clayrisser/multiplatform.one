import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Circle } from '@tamagui/lucide-icons';
import React from 'react';
import type { TooltipProps } from 'tamagui';
import { Button, Paragraph, Theme, Tooltip, TooltipGroup, XStack, YStack } from 'tamagui';

export function TooltipDemo() {
  return (
    <TooltipGroup delay={{ open: 3000, close: 100 }}>
      <YStack space="$2" alignSelf="center">
        <XStack space="$2">
          <Demo groupId="0" placement="top-end" Icon={Circle} />
          <Demo groupId="1" placement="top" Icon={ChevronUp} />
          <Demo groupId="2" placement="top-start" Icon={Circle} />
        </XStack>
        <XStack space="$2">
          <Demo groupId="3" placement="left" Icon={ChevronLeft} />
          <YStack flex={1} />
          <Demo groupId="4" placement="right" Icon={ChevronRight} />
        </XStack>
        <XStack space="$2">
          <Demo groupId="5" placement="bottom-end" Icon={Circle} />
          <Demo groupId="6" placement="bottom" Icon={ChevronDown} />
          <Demo groupId="7" placement="bottom-start" Icon={Circle} />
        </XStack>
      </YStack>
    </TooltipGroup>
  );
}

export function Demo({ Icon, ...props }: TooltipProps & { Icon?: any }) {
  return (
    <Tooltip {...props}>
      <Tooltip.Trigger>
        <Button icon={Icon} circular />
      </Tooltip.Trigger>
      <Theme inverse>
        <Tooltip.Content
          enterStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
          scale={1}
          x={0}
          y={0}
          opacity={1}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
        >
          <Tooltip.Arrow />
          <Paragraph size="$2" lineHeight="$1">
            Hello world
          </Paragraph>
        </Tooltip.Content>
      </Theme>
    </Tooltip>
  );
}
