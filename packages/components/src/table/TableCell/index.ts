/*
 * File: /src/table/TableCell/index.ts
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

import { TableContext } from '../TableContext';
import { styled, Paragraph } from 'tamagui';

export const TableCell = styled(Paragraph, {
  name: 'TableCell',
  context: TableContext,
  borderWidth: 1,
  borderColor: '$borderColor',
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
  flex: 1,
  justifyContent: 'center',
  textAlign: 'center',
  height: '$4',
  padding: '$2',
  paddingHorizontal: '$3',
  fontSize: '$5',
  ellipse: true,
  variants: {
    head: {
      true: {
        bc: '$color1',
      },
    },
    highlight: {
      true: {
        bc: '$yellow2',
      },
    },
  } as const,
});
