/**
 * File: /src/forms/SelectButton/OptionButton.tsx
 * Project: @multiplatform.one/components
 * File Created: 18-06-2024 18:02:12
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
