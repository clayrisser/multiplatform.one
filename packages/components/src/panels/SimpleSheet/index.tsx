/**
 * File: /src/panels/SimpleSheet/index.tsx
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
import type { SheetProps, DialogOverlayProps, YStackProps } from 'tamagui';
import { Sheet } from '@tamagui/sheet';

export type SimpleSheetProps = SheetProps & {
  overlayStyle?: DialogOverlayProps;
  frameStyle?: YStackProps;
};

export function SimpleSheet({ children, overlayStyle, frameStyle, ...props }: SimpleSheetProps) {
  return (
    <Sheet zIndex={100_000} {...props}>
      <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} {...overlayStyle} />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" justifyContent="center" alignItems="center" gap="$5" {...frameStyle}>
        {children}
      </Sheet.Frame>
    </Sheet>
  );
}
