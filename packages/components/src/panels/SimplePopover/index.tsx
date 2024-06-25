/**
 * File: /src/panels/SimplePopover/index.tsx
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

import type { PopoverArrowProps, PopoverContentProps, PopoverProps, PopoverTriggerProps } from 'tamagui';
import { Adapt, Button, Popover } from 'tamagui';
import React from 'react';
import type { ReactNode } from 'react';

export type SimplePopoverProps = PopoverProps & {
  contentStyle?: PopoverContentProps;
  arrowStyle?: PopoverArrowProps;
  triggerStyle?: PopoverTriggerProps;
  arrow?: boolean;
  trigger: ReactNode;
};

export function SimplePopover({
  children,
  contentStyle,
  triggerStyle,
  arrowStyle,
  arrow = true,
  trigger,
  ...props
}: SimplePopoverProps) {
  return (
    <Popover size="$5" allowFlip {...props}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Adapt when="sm" platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame padding="$4">
            <Adapt.Contents />
          </Popover.Sheet.Frame>

          <Popover.Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        </Popover.Sheet>
      </Adapt>
      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        {...contentStyle}
      >
        {arrow && <Popover.Arrow borderWidth={1} borderColor="$borderColor" {...arrowStyle} />}
        {children}
      </Popover.Content>
    </Popover>
  );
}
