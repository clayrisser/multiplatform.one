import React from 'react';
import { SimpleTabs, TabContent, TabsList, Tab } from './index';
import { H5, Separator, SizableText } from 'tamagui';

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
  <SimpleTabs defaultValue="about" orientation="horizontal" width="100%" height="100%">
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
  <SimpleTabs defaultValue="about" orientation="vertical" width="100%" height="100%">
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
