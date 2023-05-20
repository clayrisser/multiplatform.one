import { TableContext } from '../Table';
import { styled, Paragraph } from 'tamagui';

export const TableCell = styled(Paragraph, {
  name: 'TableCell',
  context: TableContext,
  bbw: 1,
  bbc: '$borderColor',
  fd: 'row',
  ai: 'center',
  pos: 'relative',
  f: 1,
  jc: 'center',
  ta: 'center',
  h: '$4',
  p: '$2',
  px: '$3',
  size: '$5',
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
