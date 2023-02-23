import React, { useState, useMemo, useEffect } from 'react';
import type { OptionButtonProps } from './OptionButton';
import type { YStackProps, ButtonProps } from 'tamagui';
import { OptionButton } from './OptionButton';
import { SelectButtonContext } from './context';
import { YStack, XStack } from 'tamagui';

export type SelectButtonProps = YStackProps & {
  onValueChange?: (value: string) => unknown;
  selectedStyle?: ButtonProps;
  selectedValue?: string;
  xStack?: boolean;
};

export function SelectButton({
  selectedValue,
  xStack,
  selectedStyle,
  onValueChange,
  ...stackProps
}: SelectButtonProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [selectedIndex, setSelectedIndex] = useState<number>();

  const contextValue = useMemo(
    () => ({
      selectedIndex,
      selectedStyle,
      setSelectedIndex,
      setValues,
      values,
    }),
    [selectedIndex, setSelectedIndex, setValues, values, selectedStyle],
  );

  useEffect(() => {
    const selectedIndexStr = selectedIndex?.toString();
    if (
      onValueChange &&
      typeof selectedIndex !== 'undefined' &&
      typeof selectedIndexStr !== 'undefined' &&
      selectedIndexStr in values
    ) {
      onValueChange(values[selectedIndexStr]);
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (typeof selectedValue === 'undefined') return;
    for (const [index, value] of Object.entries(values)) {
      const indexNum = Number(index);
      if (value === selectedValue && !Number.isNaN(indexNum)) {
        setSelectedIndex(indexNum);
        return;
      }
    }
    setSelectedIndex(undefined);
  }, [selectedValue]);

  return (
    <SelectButtonContext.Provider value={contextValue}>
      {xStack ? <XStack {...stackProps} /> : <YStack {...stackProps} />}
    </SelectButtonContext.Provider>
  );
}

SelectButton.OptionButton = OptionButton;

export type { OptionButtonProps };
