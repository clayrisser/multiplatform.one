/**
 * File: /.storybook/withTheme.tsx
 * Project: @platform/storybook-expo
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

import addons, { makeDecorator } from "@storybook/addons";
import type { ColorScheme } from "multiplatform.one/theme";
import { useTheme } from "multiplatform.one/theme";
import React, { useEffect, useState } from "react";
import type { ThemeName } from "ui";

const UPDATE_BACKGROUND = "storybook-addon-background:update";

export const withTheme = makeDecorator({
  name: "withTheme",
  parameterName: "backgrounds",
  skipIfNoParametersOrOptions: false,
  wrapper: (getStory, context, { parameters }) => {
    const channel = addons.getChannel();
    const data = (parameters || { values: [] }) as {
      default?: string;
      values: Background[];
    };
    const backgrounds: Background[] = data.values;
    const defaultValue = data.default
      ? backgrounds.find((b) => b.name === data.default)
      : undefined;
    const defaultOrFirst = defaultValue ? defaultValue : backgrounds[0];
    const [background, setBackground] = useState(defaultOrFirst?.value || "");
    const [, setTheme] = useTheme();

    // TODO: fix these effects (they were causing infinite renders)

    // useEffect(() => {
    //   channel.on(UPDATE_BACKGROUND, setBackground);
    //   return () => {
    //     channel.removeListener(UPDATE_BACKGROUND, setBackground);
    //   };
    // }, [channel]);

    // const themeName = backgrounds.find((b) => b.value === background)?.name;
    // useEffect(() => {
    //   if (!themeName) return;
    //   setTheme({ root: themeName as ColorScheme });
    // }, [themeName, setTheme]);

    return <>{getStory(context)}</>;
  },
});

interface Background {
  name: ThemeName;
  value: string;
}
