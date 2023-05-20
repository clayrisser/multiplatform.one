import { TableContext } from '../Table';
import { styled, ThemeableStack } from 'tamagui';

export const TableCol = styled(ThemeableStack, {
  name: 'TableCol',
  context: TableContext,
  brw: 1,
  brc: '$borderColor',
  f: 1,
  mr: -1,
  fd: 'column',
});
