/**
 * File: /src/panels/SimpleTooltip/SimpleTooltip.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 18-10-2023 15:23:17
 * Author: Lalit rajak
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

import type { Meta } from "@storybook/react";
import { useEffect, useState } from "react";
import { Button, Label, Switch, Text, XStack, YStack } from "tamagui";
import { type SimpleToolTipProps, SimpleTooltip } from "./index";

const meta: Meta = {
  title: "panels/SimpleTooltip",
  component: SimpleTooltip,
  parameters: { status: { type: "beta" } },
};

function Tooltip(args: SimpleToolTipProps) {
  const [arrow, setArrow] = useState(args.arrow);

  useEffect(() => {
    setArrow(args.arrow);
  }, [args.arrow]);
  return (
    <YStack gap="$4">
      <XStack gap padding="$4" alignItems="center">
        <Switch size="$3" checked={arrow} onCheckedChange={setArrow}>
          <Switch.Thumb animation="bouncy" />
        </Switch>
        <Label>arrow</Label>
        <SimpleTooltip {...args} arrow={arrow} trigger={<Button>?</Button>}>
          <Text>tooltip content</Text>
        </SimpleTooltip>
      </XStack>
    </YStack>
  );
}

export const main = (args) => <Tooltip {...args} />;
main.args = {
  arrow: true,
  themeStyle: { background: "black", color: "white" },
  triggerStyle: { background: "black", color: "white" },
  contentStyle: { background: "black", color: "white" },
  arrowStyle: { background: "black" },
};

export default meta;
