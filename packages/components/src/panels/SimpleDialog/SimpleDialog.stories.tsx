/**
 * File: /src/panels/SimpleDialog/SimpleDialog.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 13-10-2023 09:40:26
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

import { action } from "@storybook/addon-actions";
import type { Meta } from "@storybook/react";
import { useState } from "react";
import { Button, Dialog, Input, YStack } from "tamagui";
import { Text } from "tamagui";
import { SimpleDialog } from "./index";
import type { SimpleDialogProps } from "./index";

const meta: Meta = {
  title: "panels/SimpleDialog",
  component: SimpleDialog,
  parameters: { status: { type: "beta" } },
};

export const main = (args) => (
  <SimpleDialog
    onOpenChange={action("onOpenChange")}
    trigger={<Button>Press Me</Button>}
    title="Fill the details"
    withoutCloseButton
    {...args}
  >
    <Input placeholder="Enter your first name" />
    <Input placeholder="Enter your last name" />
    <Dialog.Close>
      <Button>Submit</Button>
    </Dialog.Close>
  </SimpleDialog>
);
const mainArgs: SimpleDialogProps = {
  // title: 'Simple Dialog Example',
  description: "This is a simple dialog example.",
  withoutCloseButton: false,
};
main.args = mainArgs;

function OpenWithFunction() {
  const [open, setOpen] = useState(false);

  function handlePress() {
    setOpen((open) => !open);
  }

  function handleOpenChange(open) {
    action("onOpenChange")();
    setOpen(open);
  }

  return (
    <YStack alignItems="flex-start">
      <Button onPress={handlePress}>Press Me</Button>
      <SimpleDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Fill the details"
      >
        <Input placeholder="Enter your first name" />
        <Input placeholder="Enter your last name" />
        <Dialog.Close>
          <Button>Submit</Button>
        </Dialog.Close>
      </SimpleDialog>
    </YStack>
  );
}
export const openWithFunction = (args) => <OpenWithFunction {...args} />;

openWithFunction.args = mainArgs;

export default meta;

export const customPosition = (args) => (
  <SimpleDialog
    {...args}
    trigger={<Button>open Dialog</Button>}
    withoutCloseButton
    portalStyle={{ jc: "flex-start", paddingTop: 10 }}
  >
    <YStack width={800} height={400}>
      <Input placeholder={args.search} />
    </YStack>
  </SimpleDialog>
);

customPosition.args = {
  search: "search",
};

export const rightSideDialog = (args) => (
  <SimpleDialog
    trigger={<Button>open side dialog</Button>}
    asRightSideSheet
    withoutCloseButton
    transitionWidth={400}
    contentStyle={{ animation: "quick" }}
    {...args}
  >
    <YStack width={400}>
      <Text>home</Text>
      <Text>about</Text>
      <Text>contact</Text>
      <Text>help</Text>
    </YStack>
  </SimpleDialog>
);

rightSideDialog.args = {
  asRightSideSheet: true,
  contentStyle: { animation: "quick" },
  transitionWidth: 400,
};

export const leftSideDialog = (args) => (
  <SimpleDialog
    trigger={<Button>open side dialog</Button>}
    asLeftSideSheet
    withoutCloseButton
    transitionWidth={300}
    contentStyle={{ animation: "lazy" }}
    {...args}
  >
    <YStack width={300}>
      <Text>home</Text>
      <Text>about</Text>
      <Text>contact</Text>
      <Text>help</Text>
    </YStack>
  </SimpleDialog>
);

leftSideDialog.args = {
  asLeftSideSheet: true,
  contentStyle: { animation: "lazy" },
  transitionWidth: 300,
};
