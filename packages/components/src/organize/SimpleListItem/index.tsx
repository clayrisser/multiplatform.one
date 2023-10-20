import type { ListItemProps, YStackProps } from 'ui';
import { YGroup, ListItem, XGroup } from 'ui';
import React, { useMemo } from 'react';

type SimpleListProps = YStackProps & { orientation?: 'horizontal' | 'vertical' };
type SimpleListItemProps = ListItemProps & {};

const ListContext = React.createContext<SimpleListProps | null>(null);

export function SimpleList({ children, orientation = 'vertical', backgroundColor, bg, ...props }: SimpleListProps) {
  const contextValue = useMemo(() => ({ orientation, backgroundColor, bg }), [orientation, backgroundColor, bg]);

  const renderView = () => {
    if (orientation === 'horizontal') {
      return <XGroup {...props}>{children}</XGroup>;
    }
    return <YGroup {...props}>{children}</YGroup>;
  };
  return <ListContext.Provider value={contextValue}>{renderView()}</ListContext.Provider>;
}

export function SimpleListItem({ ...props }: SimpleListItemProps) {
  const context = React.useContext(ListContext);
  if (!context) {
    throw new Error('SimpleListItem must be used within a SimpleList');
  }

  function renderItem() {
    return <ListItem hoverTheme bg={context?.backgroundColor || context?.bg} {...props} />;
  }

  if (context.orientation === 'horizontal') {
    return <XGroup.Item>{renderItem()}</XGroup.Item>;
  }
  return <YGroup.Item>{renderItem()}</YGroup.Item>;
}
