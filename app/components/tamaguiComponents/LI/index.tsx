import { Paragraph, styled } from 'tamagui';

export const Li = styled(Paragraph, {
  display: 'list-item' as any,
  tag: 'li',
  size: '$5',
  pb: '$1',
});
