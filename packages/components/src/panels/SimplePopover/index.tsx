import type { PopoverProps, PopoverContentProps, PopoverArrowProps, YStackProps } from 'tamagui';
import { Adapt, Popover } from 'tamagui';
import React from 'react';
import type { ReactNode } from 'react';
import { YStack } from 'tamagui';

export type SimplePopoverProps = PopoverProps & {
  contentStyle?: PopoverContentProps;
  arrowStyle?: PopoverArrowProps;
  triggerStyle?: YStackProps;
  trigger?: ReactNode;
  triggerOnHover?: boolean;
  arrow?: boolean;
};

export function SimplePopover({
  children,
  trigger,
  contentStyle,
  triggerStyle,
  arrowStyle,
  arrow = true,
  triggerOnHover,
  ...props
}: SimplePopoverProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover size="$5" allowFlip open={open} onOpenChange={setOpen} {...props}>
      {trigger && (
        <Popover.Trigger asChild>
          {triggerOnHover ? (
            <YStack onHoverIn={() => setOpen(true)} onHoverOut={() => setOpen(false)} {...triggerStyle}>
              {trigger}
            </YStack>
          ) : (
            trigger
          )}
        </Popover.Trigger>
      )}
      <Adapt when="sm" platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame padding="$4" onMouseEnter={() => setOpen(true)}>
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay />
        </Popover.Sheet>
      </Adapt>
      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ x: 0, y: -10, opacity: 0 }}
        exitStyle={!triggerOnHover ? { x: 0, y: -10, opacity: 0 } : undefined}
        x={0}
        y={0}
        opacity={1}
        animation={
          !triggerOnHover
            ? [
                'quick',
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]
            : undefined
        }
        elevate
        onHoverIn={triggerOnHover ? () => setOpen(true) : undefined}
        onHoverOut={triggerOnHover ? () => setOpen(false) : undefined}
        zi={9999999999}
        {...contentStyle}
      >
        {arrow && <Popover.Arrow borderWidth={1} borderColor="$borderColor" />}
        {children}
      </Popover.Content>
    </Popover>
  );
}
