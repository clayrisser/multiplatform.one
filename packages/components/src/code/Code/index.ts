/**
 * File: /src/code/Code/index.ts
 * Project: @multiplatform.one/components
 * File Created: 19-11-2024 20:26:31
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

import { isWeb } from "multiplatform.one";
import type { GetProps } from "tamagui";
import { Paragraph, styled } from "tamagui";

export const Code = styled(Paragraph, {
  name: "Code",
  borderRadius: "$4",
  cursor: "inherit",
  // @ts-ignore
  fontFamily: isWeb ? "$mono" : undefined,
  lineHeight: 18,
  padding: "$1",
  // @ts-ignore
  size: "$3",
  tag: "code",
  whiteSpace: "pre",
  variants: {
    colored: {
      true: {
        backgroundColor: "$background",
        color: "$color",
      },
    },
  } as const,
});

export const CodeInline = styled(Paragraph, {
  name: "CodeInline",
  backgroundColor: "$background",
  borderRadius: "$3",
  color: "$colorHover",
  cursor: "inherit",
  // @ts-ignore
  fontFamily: isWeb ? "$mono" : undefined,
  // @ts-ignore
  fontSize: "85%",
  padding: "$1.5",
  tag: "code",
});

export type CodeProps = GetProps<typeof Code>;

export type CodeInlineProps = GetProps<typeof CodeInline>;
