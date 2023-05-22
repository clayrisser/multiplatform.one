import React from 'react';
import { Table } from './index';

export default {
  title: 'table/Table',
  component: Table,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = () => (
  <Table heading="Choose your journey">
    <Table.Col>
      <Table.Cell head />
      <Table.Cell>1</Table.Cell>
      <Table.Cell>2</Table.Cell>
      <Table.Cell>3</Table.Cell>
    </Table.Col>
    <Table.Col>
      <Table.Cell head>Strategy</Table.Cell>
      <Table.Cell>Universal</Table.Cell>
      <Table.Cell>Lean</Table.Cell>
      <Table.Cell>Big-Budget</Table.Cell>
    </Table.Col>
    <Table.Col>
      <Table.Cell head>Native + Web</Table.Cell>
      <Table.Cell>✅</Table.Cell>
      <Table.Cell>❌</Table.Cell>
      <Table.Cell>✅</Table.Cell>
    </Table.Col>
    <Table.Col>
      <Table.Cell head>Code Sharing</Table.Cell>
      <Table.Cell>{'>'} 70%</Table.Cell>
      <Table.Cell>-</Table.Cell>
      <Table.Cell>{'<'} 30%</Table.Cell>
    </Table.Col>
    <Table.Col>
      <Table.Cell head>Feels native</Table.Cell>
      <Table.Cell>❌</Table.Cell>
      <Table.Cell>✅</Table.Cell>
      <Table.Cell>✅</Table.Cell>
    </Table.Col>
    <Table.Col>
      <Table.Cell head>Ship Fast</Table.Cell>
      <Table.Cell>✅</Table.Cell>
      <Table.Cell>✅</Table.Cell>
      <Table.Cell>❌</Table.Cell>
    </Table.Col>
  </Table>
);
