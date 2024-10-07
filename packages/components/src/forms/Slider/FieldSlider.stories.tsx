/**
 * File: /src/forms/Slider/FieldSlider.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 20-06-2024 06:03:52
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

/**
 * File: /src/forms/FormSlider/FormSlider.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 19-06-2024 09:37:30
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
import { useState } from "react";
import { Button, Text, YStack } from "tamagui";
import type { FieldSliderProps } from "./FieldSlider";
import { FieldSlider } from "./FieldSlider";

export default {
  title: "forms/FieldSlider",
  component: FieldSlider,
  parameters: {
    status: { type: "beta" },
  },
};

export const main = (args) => (
  <FieldSlider onValueChange={action("onValueChange")} {...args} />
);
const mainArgs: FieldSliderProps = {
  label: "film",
  error: undefined,
  helperText: "please check this slider",
  value: undefined,
};
main.args = mainArgs;

export const form = () => {
  const [sliderValue, setSliderValue] = useState<number[]>([0]);

  const form = useForm({
    defaultValues: {
      sliderValue: [0],
    },
    onSubmit: async ({ value }) => {
      action("onSubmit")(value);
    },
  });
  return (
    <YStack padding="$4" justifyContent="center" space>
      <Text>{[sliderValue]}</Text>
      <FieldSlider
        form={form}
        name="sliderValue"
        label="formSlider"
        onValueChange={(e) => setSliderValue(e)}
      />
      <Button onPress={form.handleSubmit}>Submit</Button>
    </YStack>
  );
};
