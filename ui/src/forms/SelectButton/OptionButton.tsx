import React, { useContext, useState, useEffect, useCallback } from 'react';
import type { ButtonProps } from 'tamagui';
import type { ComponentProps } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { Button, styled } from 'tamagui';
import { SelectButtonContext } from './context';

const defaultSelectedStyle: ButtonProps = {
  backgroundColor: '$color7',
};

const StyledButton = styled(Button, {
  focusStyle: defaultSelectedStyle,
  variants: {
    selected: {
      true: {
        ...defaultSelectedStyle,
        focusStyle: defaultSelectedStyle,
        hoverStyle: defaultSelectedStyle,
        pressStyle: defaultSelectedStyle,
      },
    },
  },
});

export type OptionButtonProps = ButtonProps & {
  index: number;
  selectedStyle?: ButtonProps;
  value: string;
};

export function OptionButton({ index, value, selectedStyle, onPress, ...buttonProps }: OptionButtonProps) {
  const [selected, setSelected] = useState(false);
  const context = useContext(SelectButtonContext);
  const mergedSelectedStyle = {
    ...context.selectedStyle,
    ...selectedStyle,
  } as ComponentProps<typeof StyledButton>;

  useEffect(() => {
    if (!context.setValues) return;
    context.setValues((values: Record<string, string>) => {
      values[index] = value;
      return values;
    });
  }, [context.setValues]);

  useEffect(() => {
    setSelected(typeof context.selectedIndex !== 'undefined' && context.selectedIndex === index);
  }, [context.selectedIndex]);

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      if (context.setSelectedIndex) context.setSelectedIndex(index);
      if (onPress) onPress(e);
    },
    [context.setSelectedIndex, onPress],
  );

  return (
    <StyledButton
      {...(buttonProps as ComponentProps<typeof StyledButton>)}
      selected={selected}
      {...(selected
        ? {
            ...(Object.keys(mergedSelectedStyle).length
              ? {
                  focusStyle: mergedSelectedStyle,
                  hoverStyle: mergedSelectedStyle,
                  pressStyle: mergedSelectedStyle,
                }
              : {}),
            ...mergedSelectedStyle,
          }
        : {
            ...(Object.keys(mergedSelectedStyle).length
              ? {
                  focusStyle: mergedSelectedStyle,
                }
              : {}),
          })}
      onPress={handlePress}
    />
  );
}
