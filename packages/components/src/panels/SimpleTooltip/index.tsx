/**
 * File: /src/panels/SimpleTooltip/index.tsx
 * Project: @multiplatform.one/components
 * File Created: 18-10-2023 15:23:17
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

import type React from "react";
import type {
  PopoverArrowProps,
  PopoverContentProps,
  PopoverTriggerProps,
  ThemeProps,
  TooltipProps,
} from "tamagui";
import { Theme, Tooltip } from "tamagui";

export type SimpleToolTipProps = TooltipProps & {
  trigger: React.ReactNode;
  themeStyle?: ThemeProps;
  contentStyle?: PopoverContentProps;
  triggerStyle?: PopoverTriggerProps;
  arrow: boolean;
  arrowStyle?: PopoverArrowProps;
};

export function SimpleTooltip({
  Icon,
  children,
  trigger,
  arrow,
  themeStyle,
  triggerStyle,
  contentStyle,
  arrowStyle,
  ...props
}: SimpleToolTipProps & { Icon?: any }) {
  return (
    <Tooltip {...props}>
      <Tooltip.Trigger {...triggerStyle}>{trigger}</Tooltip.Trigger>
      <Theme inverse {...themeStyle}>
        <Tooltip.Content
          enterStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
          scale={1}
          x={0}
          y={0}
          opacity={1}
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          {...contentStyle}
        >
          {arrow && <Tooltip.Arrow {...arrowStyle} />}
          {children}
        </Tooltip.Content>
      </Theme>
    </Tooltip>
  );
}
