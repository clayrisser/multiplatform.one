import type { PopoverProps, PopoverContentProps, AdaptProps, PopoverArrowProps } from 'tamagui';
import { Adapt, Popover, YStack } from 'tamagui';
import React from 'react';

type SimplePopoverProps = PopoverProps & {
  adaptStyle?: AdaptProps;
  contentStyle?: PopoverContentProps;
  arrowStyle?: PopoverArrowProps;
  element: React.ReactNode;
};

export function SimplePopover({
  children,
  element,
  contentStyle,
  adaptStyle,
  arrowStyle,
  ...props
}: SimplePopoverProps) {
  return (
    <Popover size="$5" allowFlip {...props}>
      <Popover.Trigger cursor="pointer" asChild>
        {children}
      </Popover.Trigger>
      <Adapt when="sm" platform="web" {...adaptStyle}>
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
        {...contentStyle}
      >
        <Popover.Arrow bw={1} boc="$borderColor" {...arrowStyle} />
        <YStack cursor="pointer">{element}</YStack>
      </Popover.Content>
    </Popover>
  );
}
