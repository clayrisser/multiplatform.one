import { Paragraph, styled } from 'tamagui';

export const Pill = styled(Paragraph, {
  tag: 'span',
  backgroundColor: '$backgroundHover',
  paddingVertical: '$1',
  paddingHorizontal: '$4',
  borderRadius: '$10',
  zIndex: 100,
  alignSelf: 'center',
  color: '$colorHover',
  size: '$3',
  fontWeight: '800',
});
