import React, { useState, useMemo } from 'react';
import { OptionButton, OptionButtonProps } from './OptionButton';
import { SelectButtonContext } from './context';
import { YStack, XStack, YStackProps, ButtonProps } from 'tamagui';
import { useEffect } from 'react';

export type SelectButtonProps = YStackProps & {
  onValueChange?: (value: number | string, key: string) => unknown;
  selectedStyle?: ButtonProps;
  selectedValue?: number | string;
  stack?: 'x' | 'y';
};

export function SelectButton(props: SelectButtonProps) {
  const { selectedValue } = props;
  const [values, setValues] = useState<Record<string, string>>({});
  const [selectedKey, setSelectedKey] = useState<string>();
  const clonedProps = { ...props };
  delete clonedProps.onValueChange;
  delete clonedProps.selectedStyle;
  delete clonedProps.selectedValue;
  delete clonedProps.stack;

  const contextValue = useMemo(
    () => ({
      selectedKey,
      setSelectedKey,
      setValues,
      values,
      selectedStyle: props.selectedStyle,
    }),
    [selectedKey, setSelectedKey, setValues, values, props.selectedStyle],
  );

  useEffect(() => {
    if (props.onValueChange && typeof selectedKey === 'string' && selectedKey in values) {
      props.onValueChange(values[selectedKey], selectedKey);
    }
  }, [selectedKey]);

  useEffect(() => {
    if (typeof selectedValue === 'undefined') return;
    for (const [key, value] of Object.entries(values)) {
      if (value === selectedValue) {
        setSelectedKey(key);
        return;
      }
    }
    setSelectedKey(undefined);
  }, [selectedValue]);

  return (
    <SelectButtonContext.Provider value={contextValue}>
      {props.stack === 'x' ? <XStack {...clonedProps} /> : <YStack {...clonedProps} />}
    </SelectButtonContext.Provider>
  );
}

SelectButton.OptionButton = OptionButton;

export type { OptionButtonProps };
