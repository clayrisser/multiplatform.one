/**
 * File: /src/mdx/UL/UL.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 25-06-2024 16:50:25
 * Author: Lavanya Katari
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
import { Text } from "tamagui";
import { UL } from "./index";

export default {
  title: "mdx/UL",
  component: UL,
  parameters: { status: { type: "beta" } },
  controls: {
    argTypes: {
      marginVertical: {
        description: "Sets the vertical margin of the unordered list",
        defaultValue: "$1",
      },
      marginLeft: {
        description: "Sets the left margin of the unordered list",
        defaultValue: "$4",
      },
      marginRight: {
        description: "Sets the right margin of the unordered list",
        defaultValue: "$2",
      },
    },
  },
};

export const main = (args) => (
  <UL {...args}>
    <Text>Hello world</Text>
  </UL>
);

const mainArgs = {};
main.args = mainArgs;
