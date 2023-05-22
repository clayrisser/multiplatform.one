import type { GetProps } from 'tamagui';
import { Paragraph, styled } from 'tamagui';
import { Platform } from 'react-native';

export const Code = styled(Paragraph, {
  name: 'Code',
  borderRadius: '$4',
  cursor: 'inherit',
  fontFamily: Platform.OS === 'web' ? '$mono' : undefined,
  lineHeight: 18,
  padding: '$1',
  size: '$3',
  tag: 'code',
  whiteSpace: 'pre',
  variants: {
    colored: {
      true: {
        backgroundColor: '$background',
        color: '$color',
      },
    },
  } as const,
});

export const CodeInline = styled(Paragraph, {
  name: 'CodeInline',
  backgroundColor: '$background',
  borderRadius: '$3',
  color: '$colorHover',
  cursor: 'inherit',
  fontFamily: Platform.OS === 'web' ? '$mono' : undefined,
  fontSize: '85%',
  padding: '$1.5',
  tag: 'code',
});

export type CodeProps = GetProps<typeof Code>;

export type CodeInlineProps = GetProps<typeof CodeInline>;
