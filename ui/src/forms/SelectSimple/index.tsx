import { ReactNode } from 'react';
import { Select, SelectProps, SelectTriggerProps, styled } from 'tamagui';

const StyledSelectTrigger = styled(Select.Trigger, {
  paddingVertical: 0,
});

export type SelectSimpleProps = SelectTriggerProps &
  Pick<SelectProps, 'onOpenChange' | 'onValueChange' | 'id'> & { placeholder?: ReactNode };

export function SelectSimple({ children, placeholder, onOpenChange, onValueChange, id, ...props }: SelectSimpleProps) {
  return (
    <Select id={id} onOpenChange={onOpenChange} onValueChange={onValueChange}>
      <StyledSelectTrigger {...props}>
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
      <Select.Content zIndex={99999}>
        <Select.Viewport>{children}</Select.Viewport>
      </Select.Content>
    </Select>
  );
}