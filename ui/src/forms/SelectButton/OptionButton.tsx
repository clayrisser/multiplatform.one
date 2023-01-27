import React, { useContext, useState, useEffect, useCallback, ComponentProps, ReactNode, useMemo } from 'react';
import { Button, styled, ButtonProps } from 'tamagui';
import { GestureResponderEvent } from 'react-native';
import { SelectButtonContext } from './context';
import { fastUnique, useWrapTextChildren } from '../../helpers';

const defaultSelectedStyle: ButtonProps = {
  bc: '$color7',
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

export type OptionButtonProps = Omit<ButtonProps, 'children'> & {
  children: ReactNode;
  selectedStyle?: ButtonProps;
  value?: number | string;
};

export function OptionButton(props: OptionButtonProps) {
  const key = useMemo(() => fastUnique(), []);
  const [selected, setSelected] = useState(false);
  const { selectedKey, selectedStyle, setSelectedKey, setValues } = useContext(SelectButtonContext);
  const children = useWrapTextChildren(props.children);
  const mergedSelectedStyle = {
    ...selectedStyle,
    ...props.selectedStyle,
  } as ComponentProps<typeof StyledButton>;

  useEffect(() => {
    if (!setValues) return;
    setValues((values: Record<string, string | number>) => {
      values[key] =
        props.value ??
        (((typeof props.children === 'string' || typeof props.children === 'number') && props.children) ||
          props.children?.toString() ||
          '');
      return values;
    });
  }, [setValues]);

  useEffect(() => {
    setSelected(typeof selectedKey !== 'undefined' && selectedKey === key);
  }, [selectedKey]);

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      if (setSelectedKey) setSelectedKey(key);
      if (props.onPress) props.onPress(e);
    },
    [setSelectedKey, props.onPress],
  );

  return (
    <StyledButton
      {...(props as ComponentProps<typeof StyledButton>)}
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
    >
      {children}
    </StyledButton>
  );
}
