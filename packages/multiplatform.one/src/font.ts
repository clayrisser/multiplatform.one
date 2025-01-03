/*
 * File: /src/font.ts
 * Project: multiplatform.one
 * File Created: 04-04-2024 15:50:39
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

import type { GenericFont } from "@tamagui/web";
import { createFont } from "@tamagui/web";

const defaults = {
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 15,
    6: 16,
    7: 18,
    8: 21,
    9: 28,
    10: 42,
    11: 52,
    12: 62,
    13: 72,
    14: 92,
    15: 114,
    16: 124,
  } as const,
  letterSpacing: {
    4: 1,
    5: 3,
    6: 3,
    9: -2,
    10: -3,
    12: -4,
  } as const,
  weight: {
    4: "300",
  } as const,
};

export function createDefaultFont<A extends GenericFont>(
  font: Partial<A> & { family: A["family"] },
): A {
  const size = font.size || defaults.size;
  return createFont({
    lineHeight: Object.fromEntries(
      Object.entries(size).map(([k, v]) => [
        k,
        typeof v === "number" ? v * 1.2 + 6 : v,
      ]),
    ) as typeof size,
    letterSpacing: defaults.letterSpacing,
    weight: defaults.weight,
    ...font,
    size,
  } as unknown as A);
}
