import React from 'react';
import type { DialogProps, DialogTitleProps, DialogDescriptionProps, DialogContentProps } from 'tamagui';
import { Adapt, Button, Dialog, Sheet, Unspaced } from 'tamagui';
import { X } from '@tamagui/lucide-icons';

type SimpleDialogProps = DialogProps & {
  description?: React.ReactNode;
  titleStyle?: DialogTitleProps;
  descriptionStyle?: DialogDescriptionProps;
  contentStyle?: DialogContentProps;
  title?: React.ReactNode;
  element: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open) => void;
};

export function SimpleDialog({
  children,
  element,
  title,
  description,
  titleStyle,
  descriptionStyle,
  contentStyle,
  open,
  ...props
}: SimpleDialogProps) {
  const [isOpen, setIsOpen] = React.useState(open);
  return (
    <Dialog
      modal
      {...props}
      open={isOpen}
      onOpenChange={(e) => {
        if (props.onOpenChange) props.onOpenChange(e);
        else setIsOpen(!isOpen);
      }}
    >
      {typeof open === 'undefined' ? <Dialog.Trigger asChild>{children}</Dialog.Trigger> : null}
      <Adapt when="sm" platform="touch">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" space>
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>
      <Dialog.Portal>
        <Dialog.Overlay key="overlay" animation="bouncy" o={0.5} enterStyle={{ o: 0 }} exitStyle={{ o: 0 }} />
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
          {...contentStyle}
        >
          <Dialog.Title {...titleStyle}>{title}</Dialog.Title>
          <Dialog.Description {...descriptionStyle}>{description ?? description}</Dialog.Description>
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
