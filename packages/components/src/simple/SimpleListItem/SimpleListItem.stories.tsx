/**
 * File: /src/simple/SimpleListItem/SimpleListItem.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 16-10-2023 14:55:52
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

import React from 'react';
import { SimpleList, SimpleListItem } from './index';
import { ChevronRight, Star } from '@tamagui/lucide-icons';
import { Label, Separator, Switch, XStack, YStack } from 'tamagui';

export default {
  title: 'simple/SimpleListItem',
  component: SimpleList,
  parameters: {
    status: { type: 'beta' },
  },
};

function Main() {
  const [orientation, setOrientation] = React.useState(true);
  return (
    <YStack fullscreen>
      <XStack width={200} alignItems="center" space="$4" alignSelf="flex-start">
        <Label paddingRight="$0" minWidth={90} justifyContent="flex-end" size="$2">
          {orientation ? 'Horizontal' : 'Vertical'}
        </Label>
        <Separator minHeight={20} vertical />
        <Switch size="$2" defaultChecked={orientation} onCheckedChange={setOrientation}>
          <Switch.Thumb animation="quick" />
        </Switch>
      </XStack>
      <SimpleList orientation={orientation ? 'horizontal' : 'vertical'}>
        <SimpleListItem title="hello" icon={Star} subTitle="how are you" iconAfter={ChevronRight} width={200} />
        <SimpleListItem title="hello" icon={Star} subTitle="how are you" iconAfter={ChevronRight} width={200} />
        <SimpleListItem title="hello" icon={Star} subTitle="how are you" iconAfter={ChevronRight} width={200} />
        <SimpleListItem title="hello" icon={Star} subTitle="how are you" iconAfter={ChevronRight} width={200} />
        <SimpleListItem title="hello" icon={Star} subTitle="how are you" iconAfter={ChevronRight} width={200} />
      </SimpleList>
    </YStack>
  );
}

export const main = () => <Main />;
