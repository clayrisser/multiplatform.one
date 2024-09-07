import { action } from "@storybook/addon-actions";
import React from "react";
import { Text } from "tamagui";
import { SelectButton } from "./SelectButton";

export default {
  title: "forms/SelectButton",
  component: SelectButton,
  parameters: {
    status: { type: "beta" },
  },
};

export const main = (args) => {
  return (
    <SelectButton gap {...args}>
      <SelectButton.OptionButton index={0} value="bmw">
        <Text>BMW</Text>
      </SelectButton.OptionButton>
      <SelectButton.OptionButton index={1} value="audi">
        <Text>AUDI</Text>
      </SelectButton.OptionButton>
      <SelectButton.OptionButton index={2} value="ford">
        <Text>FORD</Text>
      </SelectButton.OptionButton>
      <SelectButton.OptionButton index={3} value="suzuki">
        <Text>SUZUKI</Text>
      </SelectButton.OptionButton>
    </SelectButton>
  );
};

const mainArgs = {
  value: "bmw",
  selectedValue: "bmw",
};

main.args = mainArgs;

export const x = () => (
  <SelectButton gap xStack>
    <SelectButton.OptionButton index={0} value="bmw">
      <Text>BMW</Text>
    </SelectButton.OptionButton>
    <SelectButton.OptionButton index={1} value="audi">
      <Text>AUDI</Text>
    </SelectButton.OptionButton>
    <SelectButton.OptionButton index={2} value="ford">
      <Text>FORD</Text>
    </SelectButton.OptionButton>
    <SelectButton.OptionButton index={3} value="suzuki">
      <Text>SUZUKI</Text>
    </SelectButton.OptionButton>
  </SelectButton>
);
