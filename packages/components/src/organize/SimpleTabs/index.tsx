import React, { useMemo } from 'react';
import type { TabsProps, TabsContentProps, TabsTabProps, TabsListProps } from 'tamagui';
import { SizableText } from 'tamagui';
import { Separator } from 'tamagui';
import { Tabs } from 'tamagui';

export type SimpleTabsProps = TabsProps;

export type ContentProps = TabsContentProps & { route: string };

export type TabProps = TabsTabProps & { path: string };

export type ListProps = TabsListProps & { fullHeight?: boolean };

interface SimpleTabsContextProps {
  orientation: 'horizontal' | 'vertical' | undefined;
  width: number | string | undefined;
}

interface TabListContextProps {
  fullHeight: boolean;
}

const SimpleTabsContext = React.createContext<SimpleTabsContextProps | null>(null);

const TabsListContext = React.createContext<TabListContextProps | null>(null);

export function SimpleTabs({ width, height, orientation = 'horizontal', ...props }: SimpleTabsProps) {
  const contextValue = useMemo(() => ({ orientation, width }), [orientation, width]);

  return (
    <SimpleTabsContext.Provider value={contextValue}>
      <Tabs
        defaultValue={props.defaultValue ?? ''}
        orientation={orientation ?? 'horizontal'}
        flexDirection={orientation === 'vertical' ? 'row' : 'column'}
        width={width ?? 300}
        height={height ?? 150}
        borderRadius="$4"
        borderWidth="$0.25"
        overflow="hidden"
        borderColor="$borderColor"
        {...props}
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
        {...props}
        style={orientation === 'vertical' ? { display: 'flex', flexDirection: 'column' } : {}}
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
