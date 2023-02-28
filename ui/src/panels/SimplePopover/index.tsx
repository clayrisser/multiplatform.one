/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Adapt, Popover, PopoverProps, YStack, PopoverContentProps, AdaptProps, PopoverArrowProps } from 'tamagui';
import React from 'react';

type SimplePopoverProps = PopoverProps & { element: React.ReactNode } & { contentStyle?: PopoverContentProps } & {
  adaptStyle?: AdaptProps;
} & { arrowStyle?: PopoverArrowProps };

export function SimplePopover({
  children,
  element,
  contentStyle,
  adaptStyle,
  arrowStyle,
  ...props
}: SimplePopoverProps) {
  return (
    <Popover size="$5" {...props}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>

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

        <YStack>{element}</YStack>
      </Popover.Content>
    </Popover>
  );
}
