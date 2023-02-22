import React from 'react';
import type { PopoverProps } from 'tamagui';
import { Adapt, Popover, YStack } from 'tamagui';

type SimplePopoverProps = PopoverProps & { element: React.ReactNode };

export function SimplePopover({ children, element, ...props }: SimplePopoverProps) {
  return (
    <Popover size="$5" {...props}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Adapt when="sm" platform="web">
        <Popover.Sheet modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame padding="$4">
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay />
        </Popover.Sheet>
      </Adapt>
      <Popover.Content
        bw={1}
        boc="$borderColor"
        enterStyle={{ x: 10, y: -10, o: 0, scale: 0.1 }}
        exitStyle={{ x: 10, y: 10, o: 0, scale: 0.2 }}
        x={0}
        y={0}
        o={1}
        animation={[
          'bouncy',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        elevate
      >
        <Popover.Arrow bw={1} boc="$borderColor" />
        <YStack>{element}</YStack>
      </Popover.Content>
    </Popover>
  );
}
