import React from 'react';
import { Table, TableCell, TableFrame, TableCol } from './index';
import { YStack } from 'tamagui';

export default {
  title: 'ui/tamagui/MDXComponents',
  component: Table,
  parameters: { status: { type: 'keep' } },
};

export const table = () => <Table heading="MDXTable">This is coming from table from MDXComponents</Table>;
export const Code = () => <code className="className">This is coming from code from MDXComponents</code>;
export const tableCell = () => <TableCell>This is coming from TableCell from MDXComponents</TableCell>;
export const wholeTable = () => {
  return (
    <YStack>
      <TableFrame>
        <Table heading="Table heading">
          <TableCol>
            <TableCell>RisserLabs</TableCell>
            <TableCell>RisserLabs</TableCell>
          </TableCol>
          <TableCol>
            <TableCell>Flying</TableCell>
            <TableCell>Flying</TableCell>
          </TableCol>
          <TableCol>
            <TableCell>Fox</TableCell>
            <TableCell>Fox</TableCell>
          </TableCol>
          <TableCol>
            <TableCell>Labs</TableCell>
            <TableCell>Labs</TableCell>
          </TableCol>
          <TableCol>
            <TableCell>RisserLabs</TableCell>
            <TableCell>RisserLabs</TableCell>
          </TableCol>
        </Table>
      </TableFrame>
    </YStack>
  );
};
