import { Paragraph, styled } from 'tamagui';

export const Pill = styled(Paragraph, {
  tag: 'span',
  backgroundColor: '$backgroundHover',
  paddingVertical: '$1',
  paddingHorizontal: '$4',
  borderRadius: '$10',
  zi: 100,
  als: 'center',
  color: '$colorHover',
  size: '$3',
  fow: '800',
});
