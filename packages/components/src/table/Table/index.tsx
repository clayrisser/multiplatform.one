/**
 * File: /src/table/Table/index.tsx
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

import React from "react";
import { ThemeableStack, XStack, styled, withStaticProperties } from "tamagui";
import { TableCell } from "../TableCell";
import { TableCol } from "../TableCol";
import { TableContext } from "../TableContext";

export const StyledTableFrame = styled(ThemeableStack, {
  name: "Table",
  context: TableContext,
  bordered: true,
  borderRadius: "$4",
  overflow: "scroll" as "scroll" | "hidden" | "visible",
  marginVertical: "$4",
});

export const TableFrame = ({ heading, children, ...props }) => {
  return (
    <StyledTableFrame
      overflow={"scroll" as "scroll" | "hidden" | "visible"}
      {...props}
    >
      {!!heading && (
        <TableCell
          size="$4"
          backgroundColor="$color1"
          fontWeight="500"
          color="$color9"
        >
          {heading}
        </TableCell>
      )}
      <XStack minWidth="100%" alignItems="stretch">
        {children}
      </XStack>
    </StyledTableFrame>
  );
};

export const Table = withStaticProperties(TableFrame, {
  Cell: TableCell,
  Col: TableCol,
});
