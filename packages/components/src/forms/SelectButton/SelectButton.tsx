/**
 * File: /src/forms/SelectButton/index.tsx
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

import React, { useState, useMemo, useEffect } from "react";
import type { ButtonProps, YStackProps } from "tamagui";
import { XStack, YStack } from "tamagui";
import type { OptionButtonProps } from "./OptionButton";
import { OptionButton } from "./OptionButton";
import { SelectButtonContext } from "./context";

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
      typeof selectedIndex !== "undefined" &&
      typeof selectedIndexStr !== "undefined" &&
      selectedIndexStr in values
    ) {
      onValueChange(values?.[selectedIndexStr] || "");
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (typeof selectedValue === "undefined") return;
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
