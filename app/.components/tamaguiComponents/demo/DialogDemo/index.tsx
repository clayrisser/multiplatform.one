import React from 'react';
import { X } from '@tamagui/lucide-icons';
import {
  Adapt,
  Button,
  Dialog,
  Fieldset,
  H2,
  Input,
  Label,
  Paragraph,
  Sheet,
  TooltipSimple,
  Unspaced,
  YStack,
} from 'tamagui';

import { SelectDemo } from '../SelectDemo';

export function DialogDemo() {
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button>Edit Profile</Button>
      </Dialog.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" space>
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          space
        >
          <Dialog.Title>Edit profile</Dialog.Title>
          <Dialog.Description>Make changes to your profile here. Click save when you are done.</Dialog.Description>
          <Fieldset space="$4" horizontal>
            <Label width={160} justifyContent="flex-end" htmlFor="name">
              Name
            </Label>
            <Input flex={1} id="name" defaultValue="Nate Wienert" />
          </Fieldset>
          <Fieldset space="$4" horizontal>
            <Label width={160} justifyContent="flex-end" htmlFor="username">
              <TooltipSimple label="Pick your favorite" placement="bottom-start">
                <Paragraph>Food</Paragraph>
              </TooltipSimple>
            </Label>
            <SelectDemo />
          </Fieldset>

          <YStack alignItems="flex-end" marginTop="$2">
            <Dialog.Close displayWhenAdapted asChild>
              <Button theme="alt1" aria-label="Close">
                Save changes
              </Button>
            </Dialog.Close>
          </YStack>

          <Unspaced>
            <Dialog.Close asChild>
              <Button position="absolute" top="$3" right="$3" size="$2" circular icon={X} />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
