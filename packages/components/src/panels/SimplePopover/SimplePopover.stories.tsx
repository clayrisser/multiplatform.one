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

import React, { useState } from 'react';
import { SimplePopover } from './index';
import { Text, YStack, XStack, Switch, Label, Button } from 'tamagui';
import type { SimplePopoverProps } from './index';

export default {
  title: 'panels/SimplePopover',
  component: SimplePopover,
  parameters: { status: { type: 'beta' } },
};

function Hoverable() {
  const [hoverable, setHoverable] = useState(true);
  return (
    <YStack>
      <XStack gap padding="$4" alignItems="center">
        <Label>Hoverable</Label>
        <Switch size="$3" checked={hoverable} onCheckedChange={setHoverable}>
          <Switch.Thumb animation="bouncy" />
        </Switch>
      </XStack>
      <SimplePopover hoverable={hoverable} trigger={<Button>Click here to get a Popover</Button>}>
        <YStack>
          <Text>popover content</Text>
        </YStack>
      </SimplePopover>
    </YStack>
  );
}

export const main = (args) => {
  return (
    <Hoverable
      onPopoverChange={() => {}}
      trigger={
        <SimplePopover trigger={<Button>Click Here</Button>}>
          <Button>Click here to get a Popover</Button>
        </SimplePopover>
      }
      title="Popover content"
      {...args}
    />
  );
};

const mainArgs: Partial<SimplePopoverProps> = {
  open: false,
  arrow: true,
  size: 'medium',
  placement: 'bottom',
  defaultOpen: false,
  hoverable: true,
};
main.args = mainArgs;
