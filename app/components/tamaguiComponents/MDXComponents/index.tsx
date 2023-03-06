/* eslint-disable max-lines */
import { ThemeTint } from '../../../hooks/useTint';
import { Link } from '@tamagui/lucide-icons';
import { NextLink } from '../NextLink';
import React from 'react';
import { ScrollView } from 'react-native';
import type { ImageProps, XStackProps } from 'tamagui';
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
  XGroup,
  XStack,
  YStack,
  styled,
} from 'tamagui';

import { BenchmarkChart } from '../BenchmarkChart';
import { BenchmarkChartNative } from '../BenchmarkChartNative';
import { BenchmarkChartWeb } from '../BenchmarkChartWeb';
import { Code, CodeInline } from '../Code';
import { DataTable } from '../DataTable';
import * as Demos from '../Demos';
import { DocCodeBlock } from '../DocCodeBlock';
import { ExternalIcon } from '../ExternalIcon';
import { Features } from '../Features';
import { HeroContainer } from '../HeroContainer';
import { ExampleAnimations } from '../HeroExampleAnimations';
import { Highlights } from '../Highlights';
import { HR } from '../HR';
import { Li } from '../LI';
import { MediaPlayer } from '../MediaPlayer';
import { Notice, NoticeFrame } from '../Notice';
import { OffsetBox } from '../OffsetBox';
import { Preview } from '../Preview';
import { PropsTable } from '../PropsTable';
import { SocialLinksRow } from '../SocialLinkRow';
import { SponsorButton } from '../SponsorButton';
import { SubTitle } from '../SubTitle';
import { TamaguiCard } from '../TamaguiCard';
import { TamaguiExamplesCode } from '../TamaguiExamplesCode';
import { Ul } from '../UL';
import { unwrapText } from '../unwrapText';

export const TableFrame = styled(ThemeableStack, {
  bordered: true,
  borderRadius: '$4',
  overflow: 'hidden',
  marginVertical: '$4',
});

export const Table = ({ heading, children, ...props }) => {
  return (
    <TableFrame className="no-scrollbar" overflow={'scroll' as any} {...props}>
      {!!heading && (
        <TableCell size="$4" backgroundColor="$color1" fontWeight="500" color="$color9">
          {heading}
        </TableCell>
      )}
      <XStack minWidth="100%" alignItems="stretch">
        {children}
      </XStack>
    </TableFrame>
  );
};

export const code = (props) => {
  const { hero, line, scrollable, className, children, id, showLineNumbers, collapsible, ...rest } = props;
  if (!className) {
    return <CodeInline>{unwrapText(children)}</CodeInline>;
  }
  return (
    <YStack marginTop="$3">
      <DocCodeBlock
        isHighlightingLines={line !== undefined}
        className={className}
        isHero={hero !== undefined}
        isCollapsible={hero !== undefined || collapsible !== undefined}
        isScrollable={scrollable !== undefined}
        showLineNumbers={showLineNumbers !== undefined}
        {...rest}
      >
        {children}
      </DocCodeBlock>
    </YStack>
  );
};

export const TableCell = styled(Paragraph, {
  borderBottomWidth: 1,
  borderBottomColor: '$borderColor',
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
  flex: 1,
  justifyContent: 'center',
  textAlign: 'center',
  height: '$4',
  padding: '$2',
  paddingHorizontal: '$3',
  size: '$5',
  ellipse: true,

  variants: {
    head: {
      true: {
        backgroundColor: '$color1',
      },
    },
    highlight: {
      true: {
        backgroundColor: '$yellow2',
      },
    },
  },
});

export const TableCol = styled(ThemeableStack, {
  borderRightWidth: 1,
  borderRightColor: '$borderColor',
  flex: 1,
  marginRight: -1,
  flexDirection: 'column',
});

export const TableHighlight = styled(YStack, {
  fullscreen: true,
  backgroundColor: '$yellow1',
});

export const components = {
  SocialLinksRow: () => (
    <YStack marginTop="$6" marginHorizontal="$-4">
      <SocialLinksRow />
    </YStack>
  ),

  Wide: (props) => (
    <YStack marginHorizontal="$-8" $sm={{ marginHorizontal: '$-2' }}>
      {props.children}
    </YStack>
  ),

  Table,
  TableCell,
  TableHighlight,
  TableCol,

  Spacer,
  ExampleAnimations,
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

  ...Demos,

  Highlights,
  ThemeTint,
  PropsTable,
  DataTable,
  Description: SubTitle,
  Ul,
  Li,

  TamaguiExamplesCode,

  TLDR: (props) => {
    return (
      <YStack
        $gtMd={{ mx: '$-4' }}
        marginTop="$5"
        marginBottom="$3"
        paddingHorizontal="$6"
        paddingVertical="$2"
        borderRadius="$6"
        borderWidth={1}
        opacity={0.8}
        borderColor="$borderColor"
        {...props}
      />
    );
  },

  DeployToVercel: () => {
    return (
      <a
        href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftamagui%2Fstarters&root-directory=next-expo-solito/next&envDescription=Set%20this%20environment%20variable%20to%201%20for%20Turborepo%20to%20cache%20your%20node_modules.&envLink=https%3A%2F%2Ftamagui.dev&project-name=tamagui-app&repo-name=tamagui-app&demo-title=Tamagui%20App%20%E2%9A%A1%EF%B8%8F&demo-description=Tamagui%20React%20Native%20%2B%20Next.js%20starter&demo-url=https%3A%2F%2Ftamagui.dev%2Fstarter&demo-image=https%3A%2F%2Ftamagui.dev%2Fblog%2Fintroducing-tamagui%2Fhero.png"
        target="_blank"
        rel="noreferrer"
      >
        <img alt="Deploy with Vercel" style={{ height: 32, width: 90 }} src="https://vercel.com/button" />
      </a>
    );
  },

  Button,

  Beta: () => (
    <Button
      accessibilityLabel="Beta blog post"
      pointerEvents="none"
      size="$2"
      theme="pink_alt2"
      position="absolute"
      top={-15}
      right={-75}
      rotate="5deg"
    >
      Beta
    </Button>
  ),

  IntroParagraph: ({ children, large, disableUnwrapText, ...props }) => {
    return (
      <Paragraph
        tag="p"
        size={large ? '$9' : '$7'}
        className={'intro-paragraph' + (large ? ' large' : '')}
        marginHorizontal="$3"
        fontWeight={large ? '200' : '300'}
        {...props}
      >
        {disableUnwrapText ? children : unwrapText(children)}
      </Paragraph>
    );
  },

  Grid: (props) => <XStack flexWrap="wrap" justifyContent="space-between" {...props} />,
  Card: TamaguiCard,

  Note: (props) => (
    <YStack
      tag="aside"
      marginTop="$5"
      marginBottom="$5"
      borderRadius="$3"
      // & & p
      // fontSize: '$3',
      // color: '$slate11',
      // lineHeight: '23px',
      // margin: 0,
      {...props}
    />
  ),

  Aside: (props) => (
    <Paragraph color="$color11" tag="span" alignSelf="center" fontWeight="600" fontSize="$2" {...props} />
  ),

  Notice,

  h1: (props) => <H1 width="max-content" position="relative" marginBottom="$2" {...props} />,

  h2: ({ children, ...props }) => (
    <H2
      position="relative"
      width={`fit-content` as any}
      paddingTop="$8"
      marginTop="$-4"
      marginBottom="$2"
      data-heading
      {...props}
    >
      {children}
    </H2>
  ),

  h3: ({ children, id, ...props }) => (
    <LinkHeading paddingTop="$8" marginTop="$-4" marginBottom="$1" id={id}>
      <H3 position="relative" width={`fit-content` as any} nativeID={id} data-heading {...props}>
        {children}
      </H3>
      {getNonTextChildren(children)}
    </LinkHeading>
  ),

  h4: (props) => <H4 position="relative" width={`fit-content` as any} marginTop="$4" marginBottom="$3" {...props} />,

  h5: (props) => <H5 marginTop="$4" {...props} />,

  p: (props) => (
    <Paragraph
      className="docs-paragraph"
      display="block"
      fontSize={15}
      lineHeight={24}
      marginVertical="$2.5"
      {...props}
    />
  ),

  a: ({ href = '', children, ...props }) => {
    return (
      <NextLink className="link" href={href}>
        {/* @ts-ignore */}
        <Paragraph tag="span" fontSize="inherit" display="inline" cursor="pointer" {...props}>
          {children}
          {href.startsWith('http') ? (
            <>
              &nbsp;
              <Text fontSize="inherit" display="inline-flex" y={2} marginLeft={-1}>
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
    return (
      <Ul marginVertical="$4">{React.Children.toArray(children).map((x) => (typeof x === 'string' ? null : x))}</Ul>
    );
  },

  ol: (props) => <YStack {...props} tag="ol" marginBottom="$3" />,

  li: (props) => {
    return <Li marginVertical="$1">{props.children}</Li>;
  },

  strong: (props) => <Paragraph tag="strong" fontSize="inherit" {...props} fontWeight="700" />,

  img: ({ ...props }) => (
    <YStack tag="span" marginVertical="$6">
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
        flex={1}
        marginHorizontal={0}
        marginBottom="$3"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        {...(overlap && {
          marginTop: '$-6',
        })}
      >
        <Image maxWidth="100%" {...props} />
        {!!children && (
          <Text tag="figcaption" lineHeight={23} color="$colorPress" marginTop="$2">
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

  Video: ({ small, large, src, children = '', muted = true, autoPlay = true, controls, size, ...props }) => (
    <YStack tag="figure" marginHorizontal={0} marginVertical="$6">
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
      <Text tag="figcaption" lineHeight={23} marginTop="$2" color="$colorPress">
        {children}
      </Text>
    </YStack>
  ),

  blockquote: ({ children, ...props }) => {
    return (
      <YStack
        marginVertical="$4"
        paddingHorizontal="$6"
        marginLeft="$3"
        borderLeftWidth={1}
        borderColor="$borderColor"
        justifyContent="center"
        {...props}
      >
        <Paragraph
          fontFamily="$silkscreen"
          whiteSpace="revert"
          size="$8"
          lineHeight="$9"
          fontWeight="300"
          letterSpacing="$0"
          color="$color"
          opacity={0.65}
        >
          {unwrapText(children)}
        </Paragraph>
      </YStack>
    );
  },

  Preview: (props) => {
    return <Preview {...props} marginTop="$5" />;
  },

  MediaPlayerDemo: ({ theme, ...props }) => {
    return (
      <Theme name={theme}>
        <MediaPlayer {...props} />
      </Theme>
    );
  },

  GroupDisabledDemo: () => {
    return (
      <XGroup alignSelf="center" disabled>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </XGroup>
    );
  },

  DemoButton: () => <Button>Hello world</Button>,

  SponsorButton,

  SponsorNotice: () => {
    return (
      <NoticeFrame theme="red">
        <YStack maxWidth="100%" space>
          <H4 color="$color10" fontFamily="$silkscreen">
            👋 Hey! Listen!
          </H4>
          <YStack overflow="hidden" flex={1} opacity={0.85} space>
            <Paragraph>
              Tamagui is fully OSS, self-funded and built by{' '}
              <a href="https://twitter.com/natebirdman" target="_blank">
                me
              </a>
              .
            </Paragraph>
            <Paragraph>
              My goal is to support Tamagui development with sponsorships that get early access to{' '}
              <a href="#sponsors">some really interesting</a> new features.
            </Paragraph>
            <SponsorButton />
          </YStack>
        </YStack>
      </NoticeFrame>
    );
  },
};

const LinkHeading = ({ id, children, ...props }: { id: string } & XStackProps) => (
  <XStack tag="a" href={`#${id}`} id={id} data-id={id} display="inline-flex" alignItems="center" space {...props}>
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