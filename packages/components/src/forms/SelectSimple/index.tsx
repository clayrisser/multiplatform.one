/**
 * File: /src/forms/SelectSimple/index.tsx
 * Project: @multiplatform.one/components
 * File Created: 04-04-2024 15:50:39
 * Author: Clay Risser
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
import type { SelectProps, SelectTriggerProps } from 'tamagui';
import { Select, styled } from 'tamagui';

const StyledSelectTrigger = styled(Select.Trigger, {
  paddingVertical: 0,
});

export type SelectSimpleProps = SelectTriggerProps &
  Pick<SelectProps, 'onOpenChange' | 'onValueChange' | 'id' | 'value' | 'defaultValue'> & { placeholder?: ReactNode };

export function SelectSimple({
  children,
  defaultValue,
  id,
  onOpenChange,
  onValueChange,
  placeholder,
  value,
  ...triggerProps
}: SelectSimpleProps) {
  return (
    <Select id={id} onOpenChange={onOpenChange} onValueChange={onValueChange} value={value} defaultValue={defaultValue}>
      <StyledSelectTrigger {...triggerProps}>
        <Select.Value placeholder={placeholder} />
      </StyledSelectTrigger>
      <Select.Adapt when={'sm' as any} platform="touch">
        <Select.Sheet modal dismissOnSnapToBottom>
          <Select.Sheet.Frame>
            <Select.Sheet.ScrollView>
              <Select.Adapt.Contents />
            </Select.Sheet.ScrollView>
          </Select.Sheet.Frame>
          <Select.Sheet.Overlay />
        </Select.Sheet>
      </Select.Adapt>
      <Select.Content zIndex={200000}>
        <Select.Viewport>{children}</Select.Viewport>
      </Select.Content>
    </Select>
  );
}
