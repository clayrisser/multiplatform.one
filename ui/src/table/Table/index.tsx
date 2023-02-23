/* eslint-disable @typescript-eslint/consistent-type-imports */
import { YGroup } from 'tamagui';
import React from 'react';
import { TableBody, TableBodyProps } from '../TableBody/index';
import { TableHead, TableHeadProps } from '../TableHead/index';

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
