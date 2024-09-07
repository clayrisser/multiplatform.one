/**
 * File: /src/organize/SimpleListItem/index.tsx
 * Project: @multiplatform.one/components
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

import React, { useMemo } from "react";
import type { ListItemProps, YStackProps } from "tamagui";
import { ListItem, XGroup, YGroup } from "tamagui";

export type SimpleListProps = YStackProps & {
  orientation?: "horizontal" | "vertical";
  bg?: any;
};
export type SimpleListItemProps = ListItemProps & {};

const ListContext = React.createContext<SimpleListProps | null>(null);

export function SimpleList({
  children,
  orientation = "vertical",
  backgroundColor,
  bg,
  ...props
}: SimpleListProps) {
  const contextValue = useMemo(
    () => ({ orientation, backgroundColor, bg }),
    [orientation, backgroundColor, bg],
  );

  const renderView = () => {
    if (orientation === "horizontal") {
      return <XGroup {...props}>{children}</XGroup>;
    }
    return <YGroup {...props}>{children}</YGroup>;
  };
  return (
    <ListContext.Provider value={contextValue}>
      {renderView()}
    </ListContext.Provider>
  );
}

export function SimpleListItem({ ...props }: SimpleListItemProps) {
  const context = React.useContext(ListContext);
  if (!context) {
    throw new Error("SimpleListItem must be used within a SimpleList");
  }

  function renderItem() {
    return (
      <ListItem
        hoverTheme
        backgroundColor={context?.backgroundColor || (context as any)?.bg}
        {...props}
      />
    );
  }

  if (context.orientation === "horizontal") {
    return <XGroup.Item>{renderItem()}</XGroup.Item>;
  }
  return <YGroup.Item>{renderItem()}</YGroup.Item>;
}
