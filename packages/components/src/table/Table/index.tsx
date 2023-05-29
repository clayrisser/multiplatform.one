import React from 'react';
import { TableCell } from '../TableCell';
import { TableCol } from '../TableCol';
import { TableContext } from '../TableContext';
import { styled, XStack, ThemeableStack, withStaticProperties } from 'tamagui';

const StyledTableFrame = styled(ThemeableStack, {
  name: 'Table',
  context: TableContext,
  bordered: true,
  br: '$4',
  ov: 'hidden',
  my: '$4',
});

export const TableFrame = ({ heading, children, ...props }) => {
  return (
    <StyledTableFrame overflow={'scroll' as any} {...props}>
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
