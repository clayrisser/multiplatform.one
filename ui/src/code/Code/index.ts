import type { GetProps } from 'tamagui';
import { Paragraph, styled } from 'tamagui';
import { Platform } from 'react-native';

export const Code = styled(Paragraph, {
  name: 'Code',
  tag: 'code',
  fontFamily: Platform.OS === 'web' ? '$mono' : undefined,
  size: '$3',
  lineHeight: 18,
  cursor: 'inherit',
  whiteSpace: 'pre',
  padding: '$1',
  borderRadius: '$4',
  variants: {
    colored: {
      true: {
        color: '$color',
        backgroundColor: '$background',
      },
    },
  } as const,
});

export const CodeInline = styled(Paragraph, {
  name: 'CodeInline',
  tag: 'code',
  fontFamily: Platform.OS === 'web' ? '$mono' : undefined,
  color: '$colorHover',
  backgroundColor: '$background',
  cursor: 'inherit',
  br: '$3',
  fontSize: '85%',
  p: '$1.5',
});

export type CodeProps = GetProps<typeof Code>;

export type CodeInlineProps = GetProps<typeof CodeInline>;
