import React from 'react';
import type { DialogProps } from 'tamagui';
import { Adapt, Button, Dialog, Sheet, Unspaced } from 'tamagui';
import { X } from '@tamagui/lucide-icons';

type SimpleDialogProps = DialogProps & { element: React.ReactNode } & { title: React.ReactNode } & {
  description?: React.ReactNode;
};
export function SimpleDialog({ children, element, title, description, ...props }: SimpleDialogProps) {
  return (
    <Dialog modal {...props}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" space>
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay key="overlay" animation="quick" o={0.5} enterStyle={{ o: 0 }} exitStyle={{ o: 0 }} />

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
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description ?? description}</Dialog.Description>
          {element}

          <Unspaced>
            <Dialog.Close asChild>
              <Button pos="absolute" t="$3" r="$3" size="$2" circular icon={X} />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
