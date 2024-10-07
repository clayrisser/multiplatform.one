/**
 * File: /src/panels/SimpleSheet/SimpleSheet.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 25-01-2024 09:49:47
 * Author: Lalit rajak
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

import { action } from "@storybook/addon-actions";
import type { Meta } from "@storybook/react";
import { useState } from "react";
import { Button, YStack } from "tamagui";
import type { SimpleSheetProps } from "./index";
import { SimpleSheet } from "./index";

const meta: Meta = {
  title: "panels/SimpleSheet",
  component: SimpleSheet,
  parameters: { status: { type: "beta" } },
};
export const main = (args) => (
  <SimpleSheet onSheetChange={action("onSheetChange")} {...args} />
);
const mainArgs: SimpleSheetProps = {
  forceRemoveScrollEnabled: true,
  modal: true,
  open: true,
  onOpenChange: () => {},
  snapPoints: [0, 100],
  dismissOnSnapToBottom: true,
  position: 0,
  onPositionChange: () => {},
  zIndex: 100_000,
};

function Sheet() {
  const [open, setOpen] = useState(false);

  return (
    <YStack padding="$4" fullscreen>
      <Button onPress={() => setOpen(true)}>open</Button>
      <SimpleSheet open={open} onOpenChange={setOpen} modal>
        Sheet Content
      </SimpleSheet>
    </YStack>
  );
}

// export const main = () => <Sheet />;
export default meta;
