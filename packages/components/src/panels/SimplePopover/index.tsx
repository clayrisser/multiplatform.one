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
import { Adapt, Popover } from 'tamagui';
import React from 'react';
import type { ReactNode } from 'react';

export type SimplePopoverProps = PopoverProps & {
  contentStyle?: PopoverContentProps;
  arrowStyle?: PopoverArrowProps;
  triggerStyle?: PopoverTriggerProps;
  triggerOnHover?: boolean;
  closeOnHoverOut?: boolean;
  arrow?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  trigger: ReactNode;
};

export function SimplePopover({
  children,
  contentStyle,
  triggerStyle,
  arrowStyle,
  arrow = true,
  triggerOnHover,
  closeOnHoverOut,
  trigger,
  ...props
}: SimplePopoverProps) {
  const [open, setOpen] = React.useState(false);

  function handleHoverIn(e) {
    if (!triggerOnHover) return;
    setOpen(true);
    if (contentStyle?.onHoverIn) contentStyle?.onHoverIn(e);
    if (triggerStyle?.onHoverIn) triggerStyle.onHoverIn(e);
  }

  function handleHoverOut(e) {
    if (!closeOnHoverOut) return;
    setOpen(false);
    if (contentStyle?.onHoverOut) contentStyle.onHoverOut(e);
    if (triggerStyle?.onHoverOut) triggerStyle.onHoverOut(e);
  }

  return (
    <Popover size="$5" allowFlip open={open} onOpenChange={setOpen} {...props}>
      <Popover.Trigger asChild {...triggerStyle} onHoverIn={handleHoverIn} onHoverOut={handleHoverOut}>
        {trigger}
      </Popover.Trigger>
      <Adapt when="sm" platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame padding="$4" onMouseEnter={() => setOpen(true)}>
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay />
        </Popover.Sheet>
      </Adapt>
      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ x: 0, y: -10, opacity: 0 }}
        exitStyle={!triggerOnHover ? { x: 0, y: -10, opacity: 0 } : undefined}
        x={0}
        y={0}
        opacity={1}
        animation={
          !triggerOnHover
            ? [
                'quick',
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]
            : undefined
        }
        elevate
        zi={9999999999}
        {...contentStyle}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
      >
        {arrow && <Popover.Arrow borderWidth={1} borderColor="$borderColor" {...arrowStyle} />}
        {children}
      </Popover.Content>
    </Popover>
  );
}
