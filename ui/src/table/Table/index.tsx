import React from 'react';
import { TableCell } from '../TableCell';
import { styled, XStack, ThemeableStack, createStyledContext, withStaticProperties } from 'tamagui';
import { TableCol } from '../TableCol';

export const TableContext = createStyledContext({});

const StyledTableFrame = styled(ThemeableStack, {
  name: 'Table',
  context: TableContext,
  bordered: true,
  br: '$4',
  ov: 'hidden',
  my: '$4',
});

const TableFrame = ({ heading, children, ...props }) => {
  return (
    <StyledTableFrame className="no-scrollbar" overflow={'scroll' as any} {...props}>
      {!!heading && (
        <TableCell size="$4" bc="$color1" fow="500" color="$color9">
          {heading}
        </TableCell>
      )}
      <XStack minWidth="100%" ai="stretch">
        {children}
      </XStack>
    </StyledTableFrame>
  );
};

export const Table = withStaticProperties(TableFrame, {
  Cell: TableCell,
  Col: TableCol,
});
