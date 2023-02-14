import React, { ReactNode } from 'react';
import { AlertDialog, Button, XStack, YStack, AlertDialogTriggerProps, AlertDialogProps } from 'tamagui';

export type AlterDialogSimpleProps = AlertDialogTriggerProps &
  AlertDialogProps & { placeholder?: ReactNode } & { title?: ReactNode } & { cancel?: string } & { accept?: string } & {
    description?: ReactNode;
  };

export function SimpleAlertDialog({
  children,
  title,
  cancel,
  accept,
  description,
  ...triggerProps
}: AlterDialogSimpleProps) {
  return (
    <AlertDialog native {...triggerProps}>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay key="overlay" animation="quick" o={0.5} enterStyle={{ o: 0 }} exitStyle={{ o: 0 }} />
        <AlertDialog.Content
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
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack space>
            <AlertDialog.Title>{title ?? title}</AlertDialog.Title>
            <AlertDialog.Description>{description ?? description}</AlertDialog.Description>
            <XStack space="$3" jc="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>{cancel || 'cancel'}</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="active">{accept || 'accept'}</Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
