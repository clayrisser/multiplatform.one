import type {
  PopoverArrowProps,
  PopoverContentProps,
  PopoverProps,
  PopoverTriggerProps,
  StackProps,
  TamaguiElement,
  YStackProps,
} from 'tamagui';
import { Adapt, Popover, PopperAnchor, View, getState, useComposedRefs, usePopoverContext } from 'tamagui';
import React from 'react';
import type { ReactNode } from 'react';
import { YStack } from 'tamagui';

export interface PopoverCustomProps {
  contentStyle?: PopoverContentProps;
  arrowStyle?: PopoverArrowProps;
  triggerStyle?: YStackProps;
  triggerOnHover?: boolean;
  closeOnHoverOut?: boolean;
  arrow?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export interface PopoverOpen {
  triggerElement: ReactNode;
}

export type ExclusiveTriggerProps = PopoverTriggerProps | PopoverOpen;

export type SimplePopoverProps = PopoverProps & PopoverCustomProps & ExclusiveTriggerProps;

export const SimplePopoverTrigger = React.forwardRef<TamaguiElement, StackProps>((props: StackProps, forwardedRef) => {
  const context = usePopoverContext();
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);

  const trigger = (
    <View
      aria-haspopup="dialog"
      aria-expanded={context.open}
      data-state={getState(context.open)}
      {...props}
      ref={composedTriggerRef}
    />
  );

  return context.hasCustomAnchor ? trigger : <PopperAnchor asChild>{trigger}</PopperAnchor>;
});

export function SimplePopover({
  children,
  contentStyle,
  triggerStyle,
  arrowStyle,
  arrow = true,
  triggerOnHover,
  closeOnHoverOut,
  ...props
}: SimplePopoverProps) {
  const [open, setOpen] = React.useState(false);
  const trigger = 'trigger' in props;

  return (
    <Popover size="$5" allowFlip open={open} onOpenChange={setOpen} {...props}>
      {trigger &&
        props.trigger &&
        ((
          <Popover.Trigger asChild>
            {triggerOnHover ? (
              <YStack onHoverIn={() => setOpen(true)} onHoverOut={() => setOpen(false)} {...triggerStyle}>
                {props.trigger}
              </YStack>
            ) : (
              props.trigger
            )}
          </Popover.Trigger>
        ) as any)}
      {!trigger && 'triggerElement' in props && 'open' in props && (
        <SimplePopoverTrigger asChild>{props.triggerElement}</SimplePopoverTrigger>
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
        onHoverOut={triggerOnHover || closeOnHoverOut ? () => setOpen(false) : undefined}
        zi={9999999999}
        {...contentStyle}
      >
        {arrow && <Popover.Arrow borderWidth={1} borderColor="$borderColor" />}
        {children}
      </Popover.Content>
    </Popover>
  );
}
