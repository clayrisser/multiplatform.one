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

import React, { useEffect, useRef } from 'react';
import type {
  DialogProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogContentProps,
  DialogPortalProps,
  DialogOverlayProps,
} from 'tamagui';
import type { ReactNode } from 'react';
import { Adapt, Button, Dialog, Sheet, Unspaced } from 'tamagui';
import { X } from '@tamagui/lucide-icons';

export type SimpleDialogProps = DialogProps & {
  contentStyle?: DialogContentProps;
  description?: ReactNode;
  descriptionStyle?: DialogDescriptionProps;
  portalStyle?: DialogPortalProps;
  open?: boolean;
  title?: ReactNode;
  titleStyle?: DialogTitleProps;
  trigger?: ReactNode;
  withoutCloseButton?: boolean;
  overlayStyle?: DialogOverlayProps;
  onOpenChange?: (open: boolean) => void;
  asLeftSideSheet?: boolean;
  asRightSideSheet?: boolean;
};

export function SimpleDialog({
  children,
  contentStyle,
  description,
  descriptionStyle,
  title,
  titleStyle,
  trigger,
  portalStyle,
  withoutCloseButton,
  overlayStyle,
  asLeftSideSheet,
  asRightSideSheet,
  ...props
}: SimpleDialogProps) {
  const [open, setOpen] = React.useState(props.open);
  const contentRef = useRef<HTMLDivElement>(null);

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
            <Adapt.Contents ref={contentRef} />
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>
      <Dialog.Portal
        {...(asRightSideSheet && { jc: 'flex-start', ai: 'flex-end' })}
        {...(asLeftSideSheet && { jc: 'flex-start', ai: 'flex-start' })}
        {...portalStyle}
      >
        <Dialog.Overlay
          key="overlay"
          animation="bouncy"
          o={0.5}
          enterStyle={{ o: 0 }}
          exitStyle={{ o: 0 }}
          {...overlayStyle}
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
          enterStyle={{ x: 0, y: -150, opacity: 0, scale: 0.4 }}
          exitStyle={{ x: 0, y: -150, opacity: 0, scale: 0.4 }}
          space
          {...(asRightSideSheet && {
            enterStyle: { x: 100, opacity: 0 },
            exitStyle: { y: 0, opacity: 0 },
            height: '100%',
          })}
          {...(asLeftSideSheet && {
            enterStyle: { x: 100, opacity: 0 },

            exitStyle: { x: -100, opacity: 0 },
            animation: 'bouncy',
            height: '100%',
          })}
          {...contentStyle}
          ref={contentRef}
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
