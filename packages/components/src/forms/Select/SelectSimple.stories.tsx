import { action } from "@storybook/addon-actions";
import { Select } from "tamagui";
import { SelectSimple } from "./SelectSimple";

export default {
  title: "forms/SelectSimple",
  component: SelectSimple,
  parameters: {
    status: { type: "beta" },
  },
};

export const main = (args) => {
  return (
    <SelectSimple onValueChange={action("onValueChange")} {...args}>
      <Select.Item key="bmw" index={0} value="bmw">
        <Select.ItemText>BMW</Select.ItemText>
      </Select.Item>
      <Select.Item key="audi" index={1} value="audi">
        <Select.ItemText>AUDI</Select.ItemText>
      </Select.Item>
      <Select.Item key="ford" index={2} value="ford">
        <Select.ItemText>FORD</Select.ItemText>
      </Select.Item>
      <Select.Item key="suzuki" index={3} value="suzuki">
        <Select.ItemText>SUZUKI</Select.ItemText>
      </Select.Item>
    </SelectSimple>
  );
};
const mainArgs = {
  name: "FormSelectSimple",
  placeholder: "select one of these",
  defaultValue: "bmw",
  value: "bmw",
  onValueChange: "string",
};
main.args = mainArgs;
