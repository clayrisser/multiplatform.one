import React from 'react';
import type { TableBodyProps } from '../TableBody/index';
import type { TableHeadProps } from '../TableHead/index';
import { TableBody } from '../TableBody/index';
import { TableHead } from '../TableHead/index';
import { YGroup } from 'tamagui';

export type TableProps = Pick<TableHeadProps, 'label' | 'headTextStyle'> &
  Pick<TableBodyProps, 'row' | 'rowDataStyle' | 'rowStyle'> & { headRowStyle?: TableHeadProps['headRowStyle'] };

export function Table({ row, label, rowStyle, rowDataStyle, headTextStyle, headRowStyle, ...props }: TableProps) {
  return (
    <YGroup {...props}>
      <TableHead label={label} headTextStyle={headTextStyle} headRowStyle={headRowStyle} />
      <TableBody row={row} rowDataStyle={rowDataStyle} rowStyle={rowStyle} />
    </YGroup>
  );
}
