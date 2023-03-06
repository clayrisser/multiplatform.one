import { YStack, styled } from 'tamagui';

export const OffsetBox = styled(YStack, {
  name: 'OffsetBox',
  variants: {
    size: {
      hero: {
        $gtSm: { marginHorizontal: '$-2' },
        $gtMd: { marginHorizontal: '$-4' },
        $gtLg: { marginHorizontal: '$-6' },
      },
    },
  } as const,
});
