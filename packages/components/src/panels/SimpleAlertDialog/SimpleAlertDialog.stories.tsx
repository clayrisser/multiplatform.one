/**
 * File: /src/panels/SimpleAlertDialog/SimpleAlertDialog.stories.tsx
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

import { useState } from "react";
import { AlertDialog, Button, XStack, YStack } from "tamagui";
import type { AlterDialogSimpleProps } from "./index";
import { SimpleAlertDialog } from "./index";

export default {
  title: "panels/SimpleAlertDialog",
  component: SimpleAlertDialog,
  parameters: { status: { type: "beta" } },
};

export const main = (args) => (
  <SimpleAlertDialog
    title="Are you sure?"
    description="This action cannot be undone"
    cancel="Cancel"
    accept="Delete"
    trigger={<Button>Get Alert</Button>}
    {...args}
  />
);

const mainArgs: AlterDialogSimpleProps = {
  title: "Are you sure?",
  description: "This action cannot be undone",
  cancel: "Cancel",
  accept: "Delete",
};
main.args = mainArgs;
export const Custom = (args) => (
  <SimpleAlertDialog
    title="Are you sure?"
    cancel="Cancel"
    accept="Yes, Delete"
    trigger={<Button>Get Alert</Button>}
    {...mainArgs}
    {...args}
  >
    <YStack gap width={400}>
      <AlertDialog.Title>Custom Alert</AlertDialog.Title>
      <AlertDialog.Description>this is a custom alert</AlertDialog.Description>
      <XStack gap="$3" justifyContent="flex-end">
        <AlertDialog.Cancel asChild>
          <Button>cancel</Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action asChild>
          <Button theme="active">ok</Button>
        </AlertDialog.Action>
      </XStack>
    </YStack>
  </SimpleAlertDialog>
);

const Open = (args) => {
  const [open, setOpen] = useState(true);
  return (
    <YStack>
      <SimpleAlertDialog
        title="Are you sure?"
        description="This action cannot be undone"
        cancel="Cancel"
        accept="Yes, Delete"
        open={open}
        onOpenChange={setOpen}
        {...args}
      />
      <Button onPress={() => setOpen((prev) => !prev)}>
        {open ? "close" : "open"}
      </Button>
    </YStack>
  );
};

export const OpenClose = (args) => <Open {...mainArgs} {...args} />;
