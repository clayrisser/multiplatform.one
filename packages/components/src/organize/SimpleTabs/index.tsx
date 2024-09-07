/**
 * File: /src/organize/SimpleTabs/index.tsx
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

import React from "react";
import type { TabsContentProps, TabsListProps, TabsProps } from "tamagui";
import { Separator } from "tamagui";
import { Tabs } from "tamagui";

export type SimpleTabsProps = TabsProps;

export function SimpleTabs({ ...props }: SimpleTabsProps) {
  if (props.orientation === "vertical") return <VerticalTabs {...props} />;
  return <HorizontalTabs {...props} />;
}

function HorizontalTabs({ children, ...props }: SimpleTabsProps) {
  return (
    <Tabs
      flexDirection="column"
      width={400}
      height={150}
      borderRadius="$4"
      borderWidth="$0.25"
      overflow="hidden"
      borderColor="$borderColor"
      {...props}
      orientation="horizontal"
    >
      {children}
    </Tabs>
  );
}

function VerticalTabs({ children, ...props }: SimpleTabsProps) {
  return (
    <Tabs
      flexDirection="row"
      width={400}
      borderRadius="$4"
      borderWidth="$0.25"
      overflow="hidden"
      borderColor="$borderColor"
      {...props}
      orientation="vertical"
    >
      {children}
    </Tabs>
  );
}

export function TabsContent(props: TabsContentProps) {
  return (
    <Tabs.Content
      backgroundColor="$background"
      key="tab3"
      padding="$2"
      alignItems="center"
      justifyContent="center"
      flex={1}
      borderColor="$background"
      borderRadius="$2"
      borderTopLeftRadius={0}
      borderTopRightRadius={0}
      borderWidth="$2"
      {...props}
    >
      {props.children}
    </Tabs.Content>
  );
}

export function TabsList(props: TabsListProps) {
  return (
    <Tabs.List
      separator={<Separator vertical={props.orientation === "horizontal"} />}
      disablePassBorderRadius={
        props.orientation === "horizontal" ? "bottom" : "end"
      }
      aria-label="Manage your account"
      {...props}
    >
      {props.children}
    </Tabs.List>
  );
}
