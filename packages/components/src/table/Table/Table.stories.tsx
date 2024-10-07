/**
 * File: /src/table/Table/Table.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 25-06-2024 16:50:25
 * Author: Lavanya Katari
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

import { Table } from "./index";

export default {
  title: "table/Table",
  component: Table,
  parameters: {
    status: { type: "beta" },
  },
};

export const Main = () => (
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
      <Table.Cell>{">"} 70%</Table.Cell>
      <Table.Cell>-</Table.Cell>
      <Table.Cell>{"<"} 30%</Table.Cell>
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
export const main = (args) => <Main {...args} />;
main.args = {
  overflow: "visible",
  type: "multiple",
};
