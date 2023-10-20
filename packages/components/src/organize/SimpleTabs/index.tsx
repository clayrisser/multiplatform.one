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

import type { PropsWithChildren } from 'react';
import React, { useMemo } from 'react';
import type { TabsProps, TabsContentProps, TabsTabProps, TabsListProps, ThemeValueFallback, SizeTokens } from 'tamagui';
import { SizableText } from 'tamagui';
import { Separator } from 'tamagui';

import { Tabs } from 'tamagui';

export type SimpleTabsProps = Omit<TabsProps, 'defaultValue'> & { fullScreen?: boolean } & { defaultRoute?: string };

export type ContentProps = Omit<TabsContentProps, 'value'> & { route: string };

export type TabProps = Omit<TabsTabProps, 'value'> & { path: string };

export type ListProps = TabsListProps & { fullHeight?: boolean };

interface SimpleTabsContextProps extends PropsWithChildren {
  orientation: 'horizontal' | 'vertical' | undefined;
  width: SizeTokens | ThemeValueFallback | undefined;
}

interface TabListContextProps extends PropsWithChildren {
  fullHeight: boolean;
}

const SimpleTabsContext = React.createContext<SimpleTabsContextProps | null>(null);

const TabsListContext = React.createContext<TabListContextProps | null>(null);

export function SimpleTabs({
  width,
  height,
  fullScreen,
  defaultRoute,
  orientation = 'horizontal',
  ...props
}: SimpleTabsProps) {
  const contextValue = useMemo(() => ({ orientation, width }), [orientation, width]);

  return (
    <SimpleTabsContext.Provider value={contextValue}>
      <Tabs
        borderRadius="$4"
        borderWidth="$0.25"
        overflow="hidden"
        borderColor="$borderColor"
        flexDirection={orientation === 'vertical' ? 'row' : 'column'}
        defaultValue={defaultRoute}
        {...props}
        width={fullScreen ? '100%' : width ?? 300}
        height={fullScreen ? '100%' : height ?? 150}
      >
        {props.children}
      </Tabs>
    </SimpleTabsContext.Provider>
  );
}

export function TabsList({ fullHeight = false, ...props }: ListProps) {
  const context = React.useContext(SimpleTabsContext);
  if (!context) throw new Error('TabsList must be used inside SimpleTabs');
  const { orientation } = context;
  const contextValue = useMemo(() => ({ fullHeight }), [fullHeight]);

  return (
    <TabsListContext.Provider value={contextValue}>
      <Tabs.List
        separator={<Separator vertical={orientation === 'horizontal'} />}
        disablePassBorderRadius={orientation === 'horizontal' ? 'bottom' : 'end'}
        aria-label="Manage your account"
        flex={0}
        style={orientation === 'vertical' ? { display: 'flex', flexDirection: 'column' } : {}}
        {...props}
      >
        {props.children}
      </Tabs.List>
    </TabsListContext.Provider>
  );
}

export function TabContent({ route, ...props }: ContentProps) {
  return (
    <Tabs.Content
      backgroundColor="$background"
      key={route}
      padding="$2"
      flex={1}
      borderColor="$background"
      borderRadius="$2"
      borderTopLeftRadius={0}
      borderTopRightRadius={0}
      borderWidth="$2"
      value={route}
      {...props}
    >
      {props.children}
    </Tabs.Content>
  );
}

export function Tab({ path, ...props }: TabProps) {
  const context = React.useContext(SimpleTabsContext);
  const listContext = React.useContext(TabsListContext);
  if (!context) throw new Error('Tab must be used inside TabList');
  const { orientation } = context;
  if (!listContext) throw new Error('Tab must be used inside TabList');
  const { fullHeight } = listContext;

  return (
    <Tabs.Tab
      key={path}
      f={orientation === 'horizontal' || (orientation === 'vertical' && fullHeight) ? 1 : 0}
      value={path}
      {...props}
    >
      {typeof props.children === 'string' ? <SizableText>{props.children}</SizableText> : props.children}
    </Tabs.Tab>
  );
}
