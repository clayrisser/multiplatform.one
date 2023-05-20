import React from 'react';
import type { ImageProps, ParagraphProps, XStackProps, YStackProps } from 'tamagui';
import type { PropsWithChildren } from 'react';
import { BenchmarkChart } from '../BenchmarkChart';
import { BenchmarkChartNative } from '../BenchmarkChartNative';
import { BenchmarkChartWeb } from '../BenchmarkChartWeb';
import { Code, CodeInline } from '../Code';
import { DataTable } from '../DataTable';
import { DocCodeBlock } from '../DocCodeBlock';
import { ExternalIcon } from '../ExternalIcon';
import { Features } from '../Features';
import { HR } from '../HR';
import { HeroContainer } from '../HeroContainer';
import { Highlights } from '../Highlights';
import { LI } from '../LI';
import { Link } from '@tamagui/lucide-icons';
import { NextLink } from '../NextLink';
import { Notice } from '../Notice';
import { OffsetBox } from '../OffsetBox';
import { Preview } from '../Preview';
import { PropsTable } from '../PropsTable';
import { ScrollView } from 'react-native';
import { SubTitle } from '../SubTitle';
import { TamaguiCard } from '../TamaguiCard';
import { ThemeTint } from '@tamagui/logo';
import { UL } from '../Ul';
import { unwrapText } from '../../utils/unwrapText';
import {
  Button,
  H1,
  H2,
  H3,
  H4,
  H5,
  Image,
  Paragraph,
  Separator,
  Spacer,
  Text,
  Theme,
  ThemeableStack,
  TooltipSimple,
  XStack,
  YStack,
  styled,
} from 'tamagui';

export const TableFrame = styled(ThemeableStack, {
  bordered: true,
  br: '$4',
  ov: 'hidden',
  my: '$4',
});

export const Table = ({ heading, children, ...props }) => {
  return (
    <TableFrame className="no-scrollbar" overflow={'scroll' as any} {...props}>
      {!!heading && (
        <TableCell size="$4" bc="$color1" fow="500" color="$color9">
          {heading}
        </TableCell>
      )}
      <XStack minWidth="100%" ai="stretch">
        {children}
      </XStack>
    </TableFrame>
  );
};

const code = (props) => {
  const { hero, line, scrollable, className, children, id, showLineNumbers, collapsible, ...rest } = props;
  if (!className) {
    return <CodeInline>{unwrapText(children)}</CodeInline>;
  }
  return (
    <YStack mt="$3">
      <DocCodeBlock
        isHighlightingLines={line !== undefined}
        className={className}
        isHero={hero !== undefined}
        showLineNumbers={showLineNumbers !== undefined}
        {...rest}
      >
        {children}
      </DocCodeBlock>
    </YStack>
  );
};

export const TableCell = styled(Paragraph, {
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

export const TableCol = styled(ThemeableStack, {
  brw: 1,
  brc: '$borderColor',
  f: 1,
  mr: -1,
  fd: 'column',
});

export const TableHighlight = styled(YStack, {
  fullscreen: true,
  bc: '$yellow1',
});

export const components = {
  Wide: (props: PropsWithChildren) => (
    <YStack mx="$-8" $sm={{ mx: '$-2' }}>
      {props.children}
    </YStack>
  ),
  Table,
  TableCell,
  TableHighlight,
  TableCol,
  Spacer,
  ScrollView,
  Features,
  Text,
  Paragraph,
  OffsetBox,
  YStack,
  XStack,
  Theme,
  BenchmarkChart,
  Separator,
  Code,
  HeroContainer,
  BenchmarkChartNative,
  BenchmarkChartWeb,
  TooltipSimple,
  Highlights,
  ThemeTint,
  PropsTable,
  DataTable,
  Description: SubTitle,
  UL,
  LI,
  TLDR: (props) => {
    return (
      <YStack
        $gtMd={{ mx: '$-4' }}
        mt="$5"
        mb="$3"
        px="$6"
        py="$2"
        br="$6"
        bw={1}
        o={0.8}
        boc="$borderColor"
        {...props}
      />
    );
  },
  Button,
  Beta: () => (
    <Button
      accessibilityLabel="Beta blog post"
      pe="none"
      size="$2"
      theme="pink_alt2"
      pos="absolute"
      t={-15}
      r={-75}
      rotate="5deg"
    >
      Beta
    </Button>
  ),
  IntroParagraph: ({ children, large, disableUnwrapText, ...props }) => {
    return (
      <Paragraph
        tag="p"
        size={large ? '$9' : '$8'}
        className={'intro-paragraph' + (large ? ' large' : '')}
        my="$3"
        fow={large ? '200' : '300'}
        {...props}
      >
        {disableUnwrapText ? children : unwrapText(children)}
      </Paragraph>
    );
  },
  Grid: (props) => <XStack flexWrap="wrap" jc="space-between" {...props} />,
  Card: TamaguiCard,
  Note: (props: YStackProps) => <YStack tag="aside" mt="$5" mb="$5" borderRadius="$3" {...props} />,
  Aside: (props: ParagraphProps) => (
    <Paragraph color="$color11" tag="span" als="center" fow="600" fontSize="$2" {...props} />
  ),
  Notice,
  h1: (props) => <H1 width="max-content" pos="relative" mb="$2" {...props} />,
  h2: ({ children, ...props }) => (
    <H2 pos="relative" width={`fit-content` as any} pt="$8" mt="$-4" mb="$2" data-heading {...props}>
      {children}
    </H2>
  ),
  h3: ({ children, id, ...props }) => (
    <LinkHeading pt="$8" mt="$-4" mb="$1" id={id}>
      <H3 pos="relative" width={`fit-content` as any} nativeID={id} data-heading {...props}>
        {children}
      </H3>
      {getNonTextChildren(children)}
    </LinkHeading>
  ),
  h4: (props) => <H4 pos="relative" width={`fit-content` as any} mt="$4" mb="$3" {...props} />,
  h5: (props) => <H5 mt="$4" {...props} />,
  p: (props) => <Paragraph className="docs-paragraph" display="block" size="$6" my="$2.5" {...props} />,
  a: ({ href = '', children, ...props }) => {
    return (
      <NextLink className="link" href={href}>
        {/* @ts-ignore */}
        <Paragraph tag="span" fontSize="inherit" display="inline" cursor="pointer" {...props}>
          {children}
          {href.startsWith('http') ? (
            <>
              &nbsp;
              <Text fontSize="inherit" display="inline-flex" y={2} ml={-1}>
                <ExternalIcon />
              </Text>
            </>
          ) : null}
        </Paragraph>
      </NextLink>
    );
  },
  hr: HR,
  ul: ({ children }) => {
    // eslint-disable-next-line react/jsx-pascal-case
    return <UL my="$4">{React.Children.toArray(children).map((x) => (typeof x === 'string' ? null : x))}</UL>;
  },
  ol: (props) => <YStack {...props} tag="ol" mb="$3" />,
  li: (props) => {
    return (
      // eslint-disable-next-line react/jsx-pascal-case
      <LI size="$6" my="$1.5" className="docs-paragraph">
        {props.children}
      </LI>
    );
  },
  strong: (props) => <Paragraph tag="strong" fontSize="inherit" {...props} fontWeight="700" />,
  img: ({ ...props }) => (
    <YStack tag="span" my="$6">
      {/* TODO make this a proper <Image /> component */}
      <YStack tag="img" {...props} maxWidth="100%" />
    </YStack>
  ),
  pre: ({ children }) => <>{children}</>,
  code,
  Image: ({
    children,
    size,
    overlap,
    linked,
    ...props
  }: ImageProps & { size?: 'hero'; overlap?: boolean; linked?: boolean }) => {
    const content = (
      <OffsetBox
        size={size}
        tag="figure"
        f={1}
        mx={0}
        mb="$3"
        ai="center"
        jc="center"
        ov="hidden"
        {...(overlap && {
          mt: '$-6',
        })}
      >
        <Image maxWidth="100%" {...props} />
        {!!children && (
          <Text tag="figcaption" lineHeight={23} color="$colorPress" mt="$2">
            {children}
          </Text>
        )}
      </OffsetBox>
    );
    if (linked) {
      return (
        <NextLink target="_blank" href={props.src as string}>
          {content}
        </NextLink>
      );
    }
    return content;
  },
  Video: ({ src, children = '', muted = true, autoPlay = true, controls, size }) => (
    <YStack tag="figure" mx={0} my="$6">
      <OffsetBox size={size}>
        <video
          src={src}
          autoPlay={autoPlay}
          playsInline
          muted={muted}
          controls={controls}
          loop
          style={{ width: '100%', display: 'block' }}
        />
      </OffsetBox>
      <Text tag="figcaption" lineHeight={23} mt="$2" color="$colorPress">
        {children}
      </Text>
    </YStack>
  ),
  blockquote: ({ children, ...props }) => {
    return (
      <YStack my="$4" px="$6" ml="$3" borderLeftWidth={1} borderColor="$borderColor" jc="center" {...props}>
        <Paragraph
          fontFamily="$silkscreen"
          whiteSpace="revert"
          size="$8"
          lh="$9"
          fow="300"
          ls="$0"
          color="$color"
          opacity={0.65}
        >
          {unwrapText(children)}
        </Paragraph>
      </YStack>
    );
  },
  Preview: (props) => {
    return <Preview {...props} mt="$5" />;
  },
};

export const LinkHeading = ({ id, children, ...props }: { id: string } & XStackProps) => (
  <XStack tag="a" href={`#${id}`} id={id} data-id={id} display="inline-flex" ai="center" space {...props}>
    {children}
    <YStack tag="span" opacity={0.3}>
      <Link size={12} color="var(--color)" aria-hidden />
    </YStack>
  </XStack>
);

const getNonTextChildren = (children) => {
  return React.Children.map(children, (x) => {
    if (typeof x === 'string') return null;
    if (x['type'] === code) return null;
    return x;
  }).flat();
};
