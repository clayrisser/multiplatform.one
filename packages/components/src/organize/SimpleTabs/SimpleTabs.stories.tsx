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
import { SimpleTabs, TabContent, TabsList, Tab } from './index';
import { H5, SizableText } from 'tamagui';

export default {
  title: 'organize/SimpleTabs',
  component: SimpleTabs,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

export const horizontalTabs = () => (
  <SimpleTabs defaultRoute="contact" fullScreen>
    <TabsList>
      <Tab path="home">Home</Tab>
      <Tab path="about">About</Tab>
      <Tab path="contact">Contact</Tab>
      <Tab path="description">
        <SizableText textAlign="center">Description</SizableText>
      </Tab>
    </TabsList>
    <TabContent route="home">
      <H5>Home</H5>
    </TabContent>
    <TabContent route="about">
      <H5>About</H5>
    </TabContent>
    <TabContent route="contact">
      <H5>Contact</H5>
    </TabContent>
    <TabContent route="description" jc="center" ai="center">
      <H5>Default</H5>
    </TabContent>
  </SimpleTabs>
);

export const verticalTabs = () => (
  <SimpleTabs defaultRoute="about" orientation="vertical" width="100%" height="100%">
    <TabsList fullHeight={false}>
      <Tab path="home">Home</Tab>
      <Tab path="about">About</Tab>
      <Tab path="contact">Contact</Tab>
      <Tab path="description">
        <SizableText textAlign="center">Description</SizableText>
      </Tab>
    </TabsList>
    <TabContent route="home">
      <H5>Home</H5>
    </TabContent>
    <TabContent route="about">
      <H5>About</H5>
    </TabContent>
    <TabContent route="contact">
      <H5>Contact</H5>
    </TabContent>
    <TabContent route="description" jc="center" ai="center">
      <H5>Default</H5>
    </TabContent>
  </SimpleTabs>
);
