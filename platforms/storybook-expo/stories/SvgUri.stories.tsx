/**
 * File: /stories/SvgUri.stories.tsx
 * Project: @platform/storybook-native
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

import React from 'react';
import { SvgUri } from '@multiplatform.one/components/src/images/SvgUri';
import { useAssets } from '@multiplatform.one/components/src/hooks';

export default {
  title: 'images/SvgUri',
  component: SvgUri,
  parameters: {
    status: { type: 'beta' },
  },
};

function Main() {
  const [pentagonSvg] = useAssets([require('app/assets/pentagon.svg')]);
  if (!pentagonSvg?.src) return null;
  return <SvgUri width={304} height={290} uri={pentagonSvg?.src} />;
}
export const main = () => <Main />;
