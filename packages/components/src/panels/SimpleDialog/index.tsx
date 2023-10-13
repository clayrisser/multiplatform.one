/**
 * File: /src/panels/SimpleDialog/index.tsx
 * Project: @multiplatform.one/components
 * File Created: 13-10-2023 09:40:26
 * Author: Lalit rajak
 * -----
 * BitSpur (c) Copyright 2021 - 2023
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect } from 'react';
import type { DialogProps, DialogTitleProps, DialogDescriptionProps, DialogContentProps } from 'tamagui';
import type { ReactNode } from 'react';
import { Adapt, Button, Dialog, Sheet, Unspaced } from 'tamagui';
import { X } from '@tamagui/lucide-icons';

export type SimpleDialogProps = DialogProps & {
  contentStyle?: DialogContentProps;
  description?: ReactNode;
  descriptionStyle?: DialogDescriptionProps;
  open?: boolean;
  title?: ReactNode;
  titleStyle?: DialogTitleProps;
  trigger?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  withoutCloseButton?: boolean;
};

export function SimpleDialog({
  children,
  contentStyle,
  description,
  descriptionStyle,
  title,
  titleStyle,
  trigger,
  withoutCloseButton,
  ...props
}: SimpleDialogProps) {
  const [open, setOpen] = React.useState(props.open);

  useEffect(() => {
    if (typeof props.open === 'undefined' || props.open === open) return;
    setOpen(props.open);
  }, [props.open]);

  return (
    <Dialog
      modal
      {...props}
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (props.onOpenChange) props.onOpenChange(open);
      }}
    >
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
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
          {title && <Dialog.Title {...titleStyle}>{title}</Dialog.Title>}
          {description && <Dialog.Description {...descriptionStyle}>{description}</Dialog.Description>}
          {children}
          {!withoutCloseButton && (
            <Unspaced>
              <Dialog.Close asChild space>
                <Button pos="absolute" t="$3" r="$3" size="$2" circular space icon={X} />
              </Dialog.Close>
            </Unspaced>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
