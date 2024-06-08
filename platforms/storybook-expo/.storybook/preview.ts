/*
 * File: /.storybook/preview.ts
 * Project: @platform/storybook-expo
 * File Created: 01-06-2024 16:37:51
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

import config from 'app/tamagui.config';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import { withTheme } from './withTheme';

export const decorators = [withBackgrounds, withTheme];

export const parameters = {
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: config.themes.light.background.val, default: true },
      { name: 'dark', value: config.themes.dark.background.val },
    ],
  },
};
