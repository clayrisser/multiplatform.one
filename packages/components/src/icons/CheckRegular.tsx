/**
 * File: /src/icons/Check.tsx
 * Project: @multiplatform.one/components
 * File Created: 19-06-2024 10:22:17
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

import { Polyline, Rect, Svg } from "@tamagui/react-native-svg";
import { memo } from "react";
import { themed } from "./themed";

function Icon({ color = "black", size = 24, ...otherProps }) {
  return (
    <Svg viewBox="0 0 256 256" {...otherProps} height={size} width={size}>
      <Rect width="256" height="256" fill="none" />
      <Polyline
        points="216 72 104 184 48 128"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </Svg>
  );
}
Icon.displayName = "CheckRegular";
const CheckRegular = memo(themed(Icon));
export { CheckRegular };
