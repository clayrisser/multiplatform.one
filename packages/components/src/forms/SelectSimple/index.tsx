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
  placeholder,
  onOpenChange,
  onValueChange,
  defaultValue,
  value,
  id,
  ...triggerProps
}: SelectSimpleProps) {
  return (
    <Select id={id} onOpenChange={onOpenChange} onValueChange={onValueChange} value={value} defaultValue={defaultValue}>
      <StyledSelectTrigger {...triggerProps}>
        <Select.Value placeholder={placeholder} />
      </StyledSelectTrigger>
      <Select.Adapt when="sm" platform="touch">
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
