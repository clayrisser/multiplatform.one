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

import { X } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type {
  DialogContentProps,
  DialogDescriptionProps,
  DialogOverlayProps,
  DialogPortalProps,
  DialogProps,
  DialogTitleProps,
  SizeTokens,
} from "tamagui";
import { Adapt, Button, Dialog, Sheet, Unspaced } from "tamagui";

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
  transitionWidth?: number | SizeTokens | undefined;
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
  transitionWidth,
  ...props
}: SimpleDialogProps) {
  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    if (typeof props.open === "undefined" || props.open === open) return;
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
      <Adapt when={"sm" as any} platform="touch">
        <Sheet zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" gap>
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay />
        </Sheet>
      </Adapt>
      <Dialog.Portal
        {...(asRightSideSheet && { jc: "flex-start", ai: "flex-end" })}
        {...(asLeftSideSheet && { jc: "flex-start", ai: "flex-start" })}
        {...portalStyle}
      >
        <Dialog.Overlay
          key="overlay"
          animation="bouncy"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          {...overlayStyle}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -150, opacity: 0, scale: 0.4 }}
          exitStyle={{ x: 0, y: -150, opacity: 0, scale: 0.4 }}
          gap
          {...(asRightSideSheet && {
            enterStyle: { x: transitionWidth || 200, opacity: 0 },
            exitStyle: { x: transitionWidth || 200, opacity: 0 },
            position: "absolute",
            top: 0,
            bottom: 0,
          })}
          {...(asLeftSideSheet && {
            enterStyle: { x: -(transitionWidth || 100), opacity: 0 },
            exitStyle: { x: -(transitionWidth || 100), opacity: 0 },
            animation: "bouncy",
            position: "absolute",
            top: 0,
            bottom: 0,
          })}
          {...contentStyle}
        >
          <Dialog.Title disabled={!title} {...titleStyle}>
            {title}
          </Dialog.Title>
          {description && (
            <Dialog.Description {...descriptionStyle}>
              {description}
            </Dialog.Description>
          )}
          {children}
          {!withoutCloseButton && (
            <Unspaced>
              <Dialog.Close asChild gap>
                <Button
                  position="absolute"
                  top="$3"
                  right="$3"
                  size="$2"
                  circular
                  gap
                  icon={X}
                />
              </Dialog.Close>
            </Unspaced>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
