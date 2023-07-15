import React from 'react';
import type { ReactNode } from 'react';
import { AlertDialog, Button, XStack, YStack } from 'tamagui';
import type {
  AlertDialogContentProps,
  AlertDialogDescriptionProps,
  AlertDialogProps,
  AlertDialogTitleProps,
  AlertDialogTriggerProps,
  ButtonProps,
} from 'tamagui';

export type AlterDialogSimpleProps = AlertDialogTriggerProps &
  AlertDialogProps & {
    accept?: string;
    placeholder?: ReactNode;
    cancel?: string;
    title?: ReactNode;
    description: ReactNode;
    open?: boolean;
    titleStyle?: AlertDialogTitleProps;
    descriptionStyle?: AlertDialogDescriptionProps;
    contentStyle?: AlertDialogContentProps;
    onOpenChange?: (open: boolean) => void;
    onAccept?: () => void;
  } & { buttonStyle?: ButtonProps } & { customContent?: JSX.Element | undefined };

export function SimpleAlertDialog({
  children,
  title,
  cancel,
  accept,
  description,
  titleStyle,
  contentStyle,
  descriptionStyle,
  open,
  buttonStyle,
  customContent,
  ...triggerProps
}: AlterDialogSimpleProps) {
  const [isOpen, setIsOpen] = React.useState(open);

  return (
    <AlertDialog
      native
      {...triggerProps}
      open={isOpen}
      onOpenChange={(e) => {
        if (triggerProps.onOpenChange) triggerProps.onOpenChange(e);
        else setIsOpen(!isOpen);
      }}
    >
      {typeof open === 'undefined' ? <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger> : null}
      <AlertDialog.Portal>
        <AlertDialog.Overlay key="overlay" animation="quick" o={0.5} enterStyle={{ o: 0 }} exitStyle={{ o: 0 }} />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'bouncy',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.2 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.2 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
          {...contentStyle}
        >
          {customContent ? (
            customContent
          ) : (
            <YStack space>
              {title && <AlertDialog.Title>{title}</AlertDialog.Title>}
              {description && <AlertDialog.Description>{description}</AlertDialog.Description>}
              <XStack space="$3" jc="flex-end">
                <AlertDialog.Cancel asChild>
                  <Button {...buttonStyle}>{cancel || 'cancel'}</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild onPress={triggerProps.onAccept}>
                  <Button theme="active" {...buttonStyle}>
                    {accept || 'accept'}
                  </Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          )}
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
