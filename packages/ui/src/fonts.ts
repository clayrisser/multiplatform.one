/*
 * File: /src/fonts.ts
 * Project: ui
 * File Created: 30-05-2024 10:01:12
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

import { createInterFont } from "@tamagui/font-inter";
import type { GenericFonts } from "@tamagui/web/src/types";
import { createDefaultFont } from "multiplatform.one";

// export interface Fonts {
//   body: ReturnType<typeof createInterFont>;
//   heading: ReturnType<typeof createInterFont>;
//   rockSalt: ReturnType<typeof createDefaultFont>;
//   silkscreen: ReturnType<typeof createDefaultFont>;
// }

type OmitLanguagePostfix<Set> = Set extends string
  ? Set extends `${infer Prefix}_${string}`
    ? Prefix
    : Set
  : never;

type RemoveLanguagePostfixes<F extends GenericFonts> = {
  [Key in OmitLanguagePostfix<keyof F>]: F[Key];
};

export const fonts: RemoveLanguagePostfixes<GenericFonts> = {
  rockSalt: createDefaultFont({
    family: "Rock Salt",
  }),
  silkscreen: createDefaultFont({
    family: "Silkscreen",
  }),
  heading: createInterFont({
    size: {
      6: 15,
    },
    transform: {
      6: "uppercase",
      7: "none",
    },
    weight: {
      6: "400",
      7: "700",
    },
    color: {
      6: "$colorFocus",
      7: "$color",
    },
    letterSpacing: {
      5: 2,
      6: 1,
      7: 0,
      8: -1,
      9: -2,
      10: -3,
      12: -4,
      14: -5,
      15: -6,
    },
    face: {
      700: { normal: "InterBold" },
    },
  }),
  body: createInterFont(
    {
      face: {
        700: { normal: "InterBold" },
      },
    },
    {
      sizeSize: (size) => Math.round(size * 1.1),
      sizeLineHeight: (size) => Math.round(size * 1.1 + (size > 20 ? 10 : 10)),
    },
  ),
} as const;
