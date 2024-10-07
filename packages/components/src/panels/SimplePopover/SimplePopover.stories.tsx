/**
 * File: /src/panels/SimplePopover/SimplePopover.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 10-08-2023 10:50:11
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2023
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

import { useState } from "react";
import {
  Button,
  Input,
  Label,
  Popover,
  Switch,
  Text,
  XStack,
  YStack,
} from "tamagui";
import { SimplePopover } from "./index";
import type { SimplePopoverProps } from "./index";

export default {
  title: "panels/SimplePopover",
  component: SimplePopover,
  parameters: { status: { type: "beta" } },
};
export const main = (args) => (
  <SimplePopover
    trigger={<Button>Click here to get a Popover</Button>}
    title="Popover content"
    {...args}
  >
    <Text>Popover content</Text>
  </SimplePopover>
);

function Hoverable(args) {
  const [hoverable, setHoverable] = useState(true);
  return (
    <YStack>
      <SimplePopover
        hoverable={hoverable}
        trigger={<Button>Click here to get a Popover</Button>}
        {...args}
      >
        <YStack>
          <Text>popover content</Text>
        </YStack>
      </SimplePopover>
    </YStack>
  );
}

export const hoverable = (args) => <Hoverable {...args} />;
