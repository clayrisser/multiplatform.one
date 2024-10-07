/**
 * File: /src/forms/Input/FieldInput.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 10-10-2023 06:39:34
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

import { action } from "@storybook/addon-actions";
import { useForm } from "@tanstack/react-form";
import { Button } from "tamagui";
import { YStack } from "tamagui";
import { FieldInput } from "./FieldInput";
import type { FieldInputProps } from "./FieldInput";

export default {
  title: "forms/FieldInput",
  component: FieldInput,
  parameters: {
    status: { type: "beta" },
  },
};

export const main = (args) => (
  <FieldInput onCheckedChange={action("onCheckedChange")} {...args} />
);
const mainArgs: FieldInputProps = {
  label: "Hi",
  error: undefined,
  helperText: "please check this input",
  mode: undefined,
  size: "$1",
};
main.args = mainArgs;

export const form = () => {
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
    onSubmit: async ({ value }) => {
      action("onSubmit")(value);
    },
  });
  return (
    <YStack>
      <FieldInput label="FIRST NAME" name="firstName" form={form} />
      <FieldInput label="LAST NAME" name="lastName" form={form} />
      <Button onPress={form.handleSubmit}>Submit</Button>
    </YStack>
  );
};
