/**
 * File: /src/icons/themed.tsx
 * Project: @multiplatform.one/components
 * File Created: 19-06-2024 10:25:51
 * Author: Clay Risser
 * Author: Dominic Garms
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

import React from "react";
import type { FC } from "react";
import {
  getTokens,
  getVariable,
  getVariableValue,
  useProps,
  useTheme,
} from "tamagui";

export function themed<A extends FC>(Component: A) {
  return ((props: any) => {
    const { color, disableTheme, size } = useProps(props);
    const theme = useTheme();
    return (
      <Component
        {...props}
        color={getVariable(
          (color in theme ? theme[color] : undefined) ||
            color ||
            (!disableTheme ? theme.color : null) ||
            "#000",
        )}
        size={
          typeof size === "string"
            ? getVariableValue(getTokens().size[size] || size)
            : size
        }
      />
    );
  }) as A;
}
