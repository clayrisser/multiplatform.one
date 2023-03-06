import { H1, H2, H3, styled } from 'tamagui';

export const HomeH1 = styled(H1, {
  className: 'word-break-keep-all',
  size: '$9',
  marginBottom: '$2',

  $gtSm: {
    size: '$10',
    maxWidth: '90%',
  },
});

export const HomeH2 = styled(H2, {
  className: 'word-break-keep-all',
  name: 'HomeH2',
  textAlign: 'center',
  alignSelf: 'center',
  size: '$10',
  maxWidth: 720,
  marginTop: '$-2',
  $sm: {
    size: '$10',
  },
  $xs: {
    size: '$9',
  },
});

export const HomeH3 = styled(H3, {
  className: 'word-break-keep-all',
  fontFamily: '$body',
  name: 'HomeH3',
  textAlign: 'center',
  theme: 'alt1',
  alignSelf: 'center',
  fontWeight: '400',
  paddingHorizontal: 20,
  size: '$8',
  opacity: 0.9,
  letterSpacing: -0.15,
  maxWidth: 690,

  $sm: {
    fontWeight: '400',
    size: '$6',
    color: '$color',
    textTransform: 'none',
  },
});
