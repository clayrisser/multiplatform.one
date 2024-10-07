/**
 * File: /src/forms/RadioGroup/FieldRadioGroup.stories.tsx
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

import { action } from "@storybook/addon-actions";
import { useForm } from "@tanstack/react-form";
import { Text, YStack } from "tamagui";
import { SubmitButton } from "../Button";
import type { FieldRadioGroupProps } from "./FieldRadioGroup";
import { FieldRadioGroup } from "./FieldRadioGroup";

export default {
  title: "forms/FieldRadioGroup",
  component: FieldRadioGroup,
  parameters: { status: { type: "beta" } },
};

export const main = (args) => <FieldRadioGroup {...args} />;
const mainArgs: FieldRadioGroupProps = {
  label: "radio group",
  error: undefined,
  helperText: "Select an option",
  mode: undefined,
  size: "SizeToken",
  value: "option1",
};
main.args = mainArgs;

export const form = () => {
  const form = useForm({
    defaultValues: {
      option: "option1",
    },
    onSubmit: async ({ value }) => {
      action("onSubmit")(value);
    },
  });
  return (
    <YStack>
      <FieldRadioGroup
        form={form}
        gap
        helperText="select an option"
        label="radio group"
        size="SizeToken"
        name="option"
        onValueChange={action("onValueChange")}
        required
      >
        <FieldRadioGroup.Item size="SizeToken" value="option1">
          <Text htmlFor="option1">option 1</Text>
        </FieldRadioGroup.Item>
        <FieldRadioGroup.Item size="$4" value="option2">
          <Text htmlFor="option2">option 2</Text>
        </FieldRadioGroup.Item>
        <FieldRadioGroup.Item size="$4" value="option3">
          <Text htmlFor="option3">option 3</Text>
        </FieldRadioGroup.Item>
        <FieldRadioGroup.Item size="$4" value="option4">
          <Text htmlFor="option4">option 4</Text>
        </FieldRadioGroup.Item>
      </FieldRadioGroup>
      <SubmitButton form={form}>Submit</SubmitButton>
    </YStack>
  );
};
