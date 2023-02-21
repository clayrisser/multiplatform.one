import { Adapt, Popover, PopoverProps, YStack } from 'tamagui';
import React from 'react';

type SimplePopoverProps = PopoverProps & { element: React.ReactNode };

export function SimplePopover({ children, element, ...props }: SimplePopoverProps) {
  return (
    <Popover size="$5" {...props}>
<<<<<<< HEAD
      <Popover.Trigger asChild>{children}</Popover.Trigger>
=======
      <Popover.Trigger asChild>
        {children}
        {/* <Button icon={Icon} /> */}
      </Popover.Trigger>
>>>>>>> 2afb79c7c4331e22a69824ea1e0fd893f0fe190d

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

<<<<<<< HEAD
        <YStack>{element}</YStack>
=======
        <YGroup space="$3">
          <XStack space="$3">
            {/* <Label size="$3" htmlFor={Name}>
              Name
            </Label> */}
            {/* <Input size="$3" id={Name} /> */}
          </XStack>
          <Popover.Close asChild>
            <Button
              size="$3"
              onPress={() => {
                /* Custom code goes here, does not interfere with popover closure */
              }}
            >
              Submit
            </Button>
          </Popover.Close>
        </YGroup>
>>>>>>> 2afb79c7c4331e22a69824ea1e0fd893f0fe190d
      </Popover.Content>
    </Popover>
  );
}
