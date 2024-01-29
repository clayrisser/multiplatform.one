/**
 * File: /src/organize/SimpleTabs/SimpleTabs.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 18-10-2023 15:23:17
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
import { SimpleTabs, TabsList, TabsContent } from './index';
import { H5, SizableText, Tabs, Separator, YStack, Switch, XStack, Text } from 'tamagui';

export default {
  title: 'organize/SimpleTabs',
  component: SimpleTabs,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

const Main = () => {
  const [orientation, setOrientation] = React.useState<'horizontal' | 'vertical'>('horizontal');
  const [isHorizontal, setIsHorizontal] = React.useState(true);

  React.useEffect(() => {
    setOrientation(isHorizontal ? 'horizontal' : 'vertical');
  }, [isHorizontal]);

  return (
    <YStack space padding="$4">
      <XStack space>
        <Switch size="$3" checked={isHorizontal} onCheckedChange={setIsHorizontal}>
          <Switch.Thumb animation="bouncy" />
        </Switch>
        <Text>{orientation}</Text>
      </XStack>
      <SimpleTabs orientation={orientation} defaultValue="home">
        <TabsList justifyContent="space-between" orientation={orientation}>
          <Tabs.Tab value="home" flex={1}>
            <SizableText textAlign="center">Home</SizableText>
          </Tabs.Tab>
          <Tabs.Tab value="about" flex={1}>
            <SizableText textAlign="center">About</SizableText>
          </Tabs.Tab>
          <Tabs.Tab value="contact" flex={1}>
            <SizableText textAlign="center">Contact</SizableText>
          </Tabs.Tab>
        </TabsList>
        <Separator vertical={orientation === 'vertical'} />
        <TabsContent value="home">
          <H5>Home</H5>
        </TabsContent>
        <TabsContent value="about">
          <H5>About</H5>
        </TabsContent>
        <TabsContent value="contact">
          <H5>Contact</H5>
        </TabsContent>
      </SimpleTabs>
    </YStack>
  );
};

export const main = () => <Main />;
