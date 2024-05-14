/**
 * File: /src/panels/SimpleAlertDialog/index.tsx
 * Project: @multiplatform.one/components
 * File Created: 25-01-2024 09:49:47
 * Author: Lalit rajak
 * -----
 * BitSpur (c) Copyright 2021 - 2024
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
  AlertDialogActionProps,
} from 'tamagui';

export type AlterDialogSimpleProps = AlertDialogProps & {
  accept?: string;
  placeholder?: ReactNode;
  cancel?: string;
  title?: ReactNode;
  trigger?: JSX.Element | undefined;
  description: ReactNode;
  titleStyle?: AlertDialogTitleProps;
  descriptionStyle?: AlertDialogDescriptionProps;
  contentStyle?: AlertDialogContentProps;
  actionStyle?: AlertDialogActionProps;
  triggerStyle?: AlertDialogTriggerProps;
  onAccept?: () => void;
  onCancel?: () => void;
} & { buttonStyle?: ButtonProps } & {};

export function SimpleAlertDialog({
  children,
  title,
  cancel,
  accept,
  description,
  titleStyle,
  contentStyle,
  descriptionStyle,
  buttonStyle,
  trigger,
  actionStyle,
  triggerStyle,
  onAccept,
  onCancel,
  ...props
}: AlterDialogSimpleProps) {
  return (
    <AlertDialog native {...props}>
      <AlertDialog.Trigger {...triggerStyle} asChild>
        {trigger}
      </AlertDialog.Trigger>
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
          {children ? (
            children
          ) : (
            <YStack gap>
              {title && <AlertDialog.Title {...titleStyle}>{title}</AlertDialog.Title>}
              {description && <AlertDialog.Description {...descriptionStyle}>{description}</AlertDialog.Description>}
              <XStack gap="$3" jc="flex-end">
                <AlertDialog.Cancel asChild>
                  <Button onPress={onCancel} {...buttonStyle}>
                    {cancel || 'cancel'}
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild {...actionStyle}>
                  <Button theme="active" onPress={onAccept} {...buttonStyle}>
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
