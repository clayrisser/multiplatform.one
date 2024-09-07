/**
 * File: /src/mdx/MDXCodeBlock/MDXCodeBlock.stories.tsx
 * Project: @multiplatform.one/components
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

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Text, XStack } from "tamagui";
import { MDXCodeBlock } from "./index";

const meta: Meta = {
  title: "mdx/MDXCodeBlock",
  component: MDXCodeBlock,
  parameters: {
    status: { type: "beta" },
  },
};

export const main: StoryObj<typeof MDXCodeBlock> = {
  args: {
    isCollapsible: false,
    background: "$color3",
  },
  render: (args) => (
    <MDXCodeBlock {...args}>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
      <XStack>
        <Text>const hello = &quot;world&quot;</Text>
      </XStack>
    </MDXCodeBlock>
  ),
};

export default meta;
