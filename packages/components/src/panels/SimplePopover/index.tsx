import type { PopoverProps, PopoverContentProps, PopoverArrowProps } from 'tamagui';
import { Adapt, Popover } from 'tamagui';
import React from 'react';
import type { ReactNode } from 'react';

export type SimplePopoverProps = PopoverProps & {
  contentStyle?: PopoverContentProps;
  arrowStyle?: PopoverArrowProps;
  trigger: ReactNode;
};

export function SimplePopover({ children, trigger, contentStyle, arrowStyle, ...props }: SimplePopoverProps) {
  return (
    <Popover size="$5" allowFlip {...props}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Adapt when="sm" platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame padding="$4">
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay />
        </Popover.Sheet>
      </Adapt>
      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ x: 0, y: -10, opacity: 0 }}
        exitStyle={{ x: 0, y: -10, opacity: 0 }}
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
        elevate
        {...contentStyle}
      >
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />
        {children}
      </Popover.Content>
    </Popover>
  );
}
