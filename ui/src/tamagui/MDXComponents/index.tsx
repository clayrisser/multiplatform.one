/* eslint-disable max-lines */
// import { ThemeTint } from '../../hooks/useTint';
// import { Link } from '@tamagui/lucide-icons';
// import { NextLink } from '../NextLink';
import React from 'react';
// import { ScrollView } from 'react-native';
// import type { ImageProps, XStackProps } from 'tamagui';
import {
  // Button,
  // H1,
  // H2,
  // H3,
  // H4,
  // H5,
  // Image,
  Paragraph,
  // Separator,
  // Spacer,
  // Text,
  // Theme,
  ThemeableStack,
  // TooltipSimple,
  // XGroup,
  XStack,
  YStack,
  styled,
} from 'tamagui';

// import { BenchmarkChart } from '../BenchmarkChart';
// import { BenchmarkChartNative } from '../BenchmarkChartNative';
// import { BenchmarkChartWeb } from '../BenchmarkChartWeb';
import { CodeInline } from '../Code';
// import { DataTable } from '../DataTable';
// import * as Demos from '../Demos';
import { DocCodeBlock } from '../DocCodeBlock';
// import { ExternalIcon } from '../ExternalIcon';
// import { Features } from '../Features';
// import { HeroContainer } from '../HeroContainer';
// import { ExampleAnimations } from '../HeroExampleAnimations';
// import { Highlights } from '../Highlights';
// import { HR } from '../HR';
// import { Li } from '../LI';
// import { MediaPlayer } from '../MediaPlayer';
// import { Notice, NoticeFrame } from '../Notice';
// import { OffsetBox } from '../OffsetBox';
// import { Preview } from '../Preview';
// import { PropsTable } from '../PropsTable';
// import { SocialLinksRow } from '../SocialLinkRow';
// import { SponsorButton } from '../SponsorButton';
// import { SubTitle } from '../SubTitle';
// import { TamaguiCard } from '../TamaguiCard';
// import { TamaguiExamplesCode } from '../TamaguiExamplesCode';
// import { Ul } from '../UL';
import { unwrapText } from '../unwrapText';

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

export const code = (props) => {
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
  },
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

// export const components = {
//   SocialLinksRow: () => (
//     <YStack mt="$6" mx="$-4">
//       <SocialLinksRow />
//     </YStack>
//   ),

//   Wide: (props) => (
//     <YStack mx="$-8" $sm={{ mx: '$-2' }}>
//       {props.children}
//     </YStack>
//   ),

//   Table,
//   TableCell,
//   TableHighlight,
//   TableCol,

//   Spacer,
//   ExampleAnimations,
//   ScrollView,
//   Features,
//   Text,
//   Paragraph,
//   OffsetBox,
//   YStack,
//   XStack,
//   Theme,
//   BenchmarkChart,
//   Separator,
//   Code,
//   HeroContainer,
//   BenchmarkChartNative,
//   BenchmarkChartWeb,
//   TooltipSimple,

//   ...Demos,

//   Highlights,
//   ThemeTint,
//   PropsTable,
//   DataTable,
//   Description: SubTitle,
//   Ul,
//   Li,

//   TamaguiExamplesCode,

//   TLDR: (props) => {
//     return (
//       <YStack
//         $gtMd={{ mx: '$-4' }}
//         mt="$5"
//         mb="$3"
//         px="$6"
//         py="$2"
//         br="$6"
//         bw={1}
//         o={0.8}
//         boc="$borderColor"
//         {...props}
//       />
//     );
//   },

//   DeployToVercel: () => {
//     return (
//       <a
//         href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftamagui%2Fstarters&root-directory=next-expo-solito/next&envDescription=Set%20this%20environment%20variable%20to%201%20for%20Turborepo%20to%20cache%20your%20node_modules.&envLink=https%3A%2F%2Ftamagui.dev&project-name=tamagui-app&repo-name=tamagui-app&demo-title=Tamagui%20App%20%E2%9A%A1%EF%B8%8F&demo-description=Tamagui%20React%20Native%20%2B%20Next.js%20starter&demo-url=https%3A%2F%2Ftamagui.dev%2Fstarter&demo-image=https%3A%2F%2Ftamagui.dev%2Fblog%2Fintroducing-tamagui%2Fhero.png"
//         target="_blank"
//         rel="noreferrer"
//       >
//         <img alt="Deploy with Vercel" style={{ height: 32, width: 90 }} src="https://vercel.com/button" />
//       </a>
//     );
//   },

//   Button,

//   Beta: () => (
//     <Button
//       accessibilityLabel="Beta blog post"
//       pe="none"
//       size="$2"
//       theme="pink_alt2"
//       pos="absolute"
//       t={-15}
//       r={-75}
//       rotate="5deg"
//     >
//       Beta
//     </Button>
//   ),

//   IntroParagraph: ({ children, large, disableUnwrapText, ...props }) => {
//     return (
//       <Paragraph
//         tag="p"
//         size={large ? '$9' : '$7'}
//         className={'intro-paragraph' + (large ? ' large' : '')}
//         my="$3"
//         fow={large ? '200' : '300'}
//         {...props}
//       >
//         {disableUnwrapText ? children : unwrapText(children)}
//       </Paragraph>
//     );
//   },

//   Grid: (props) => <XStack flexWrap="wrap" jc="space-between" {...props} />,
//   Card: TamaguiCard,

//   Note: (props) => (
//     <YStack
//       tag="aside"
//       mt="$5"
//       mb="$5"
//       borderRadius="$3"
//       // & & p
//       // fontSize: '$3',
//       // color: '$slate11',
//       // lineHeight: '23px',
//       // margin: 0,
//       {...props}
//     />
//   ),

//   Aside: (props) => <Paragraph color="$color11" tag="span" als="center" fow="600" fontSize="$2" {...props} />,

//   Notice,

//   h1: (props) => <H1 width="max-content" pos="relative" mb="$2" {...props} />,

//   h2: ({ children, ...props }) => (
//     <H2 pos="relative" width={`fit-content` as any} pt="$8" mt="$-4" mb="$2" data-heading {...props}>
//       {children}
//     </H2>
//   ),

//   h3: ({ children, id, ...props }) => (
//     <LinkHeading pt="$8" mt="$-4" mb="$1" id={id}>
//       <H3 pos="relative" width={`fit-content` as any} nativeID={id} data-heading {...props}>
//         {children}
//       </H3>
//       {getNonTextChildren(children)}
//     </LinkHeading>
//   ),

//   h4: (props) => <H4 pos="relative" width={`fit-content` as any} mt="$4" mb="$3" {...props} />,

//   h5: (props) => <H5 mt="$4" {...props} />,

//   p: (props) => (
//     <Paragraph className="docs-paragraph" display="block" fontSize={15} lineHeight={24} my="$2.5" {...props} />
//   ),

//   a: ({ href = '', children, ...props }) => {
//     return (
//       <NextLink className="link" href={href}>
//         {/* @ts-ignore */}
//         <Paragraph tag="span" fontSize="inherit" display="inline" cursor="pointer" {...props}>
//           {children}
//           {href.startsWith('http') ? (
//             <>
//               &nbsp;
//               <Text fontSize="inherit" display="inline-flex" y={2} ml={-1}>
//                 <ExternalIcon />
//               </Text>
//             </>
//           ) : null}
//         </Paragraph>
//       </NextLink>
//     );
//   },

//   hr: HR,

//   ul: ({ children }) => {
//     return <Ul my="$4">{React.Children.toArray(children).map((x) => (typeof x === 'string' ? null : x))}</Ul>;
//   },

//   ol: (props) => <YStack {...props} tag="ol" mb="$3" />,

//   li: (props) => {
//     return <Li marginVertical="$1">{props.children}</Li>;
//   },

//   strong: (props) => <Paragraph tag="strong" fontSize="inherit" {...props} fontWeight="700" />,

//   img: ({ ...props }) => (
//     <YStack tag="span" my="$6">
//       {/* TODO make this a proper <Image /> component */}
//       <YStack tag="img" {...props} maxWidth="100%" />
//     </YStack>
//   ),

//   pre: ({ children }) => <>{children}</>,

//   code,

//   Image: ({
//     children,
//     size,
//     overlap,
//     linked,
//     ...props
//   }: ImageProps & { size?: 'hero'; overlap?: boolean; linked?: boolean }) => {
//     const content = (
//       <OffsetBox
//         size={size}
//         tag="figure"
//         f={1}
//         mx={0}
//         mb="$3"
//         ai="center"
//         jc="center"
//         ov="hidden"
//         {...(overlap && {
//           mt: '$-6',
//         })}
//       >
//         <Image maxWidth="100%" {...props} />
//         {!!children && (
//           <Text tag="figcaption" lineHeight={23} color="$colorPress" mt="$2">
//             {children}
//           </Text>
//         )}
//       </OffsetBox>
//     );

//     if (linked) {
//       return (
//         <NextLink target="_blank" href={props.src as string}>
//           {content}
//         </NextLink>
//       );
//     }

//     return content;
//   },

//   Video: ({ small, large, src, children = '', muted = true, autoPlay = true, controls, size, ...props }) => (
//     <YStack tag="figure" mx={0} my="$6">
//       <OffsetBox size={size}>
//         <video
//           src={src}
//           autoPlay={autoPlay}
//           playsInline
//           muted={muted}
//           controls={controls}
//           loop
//           style={{ width: '100%', display: 'block' }}
//         />
//       </OffsetBox>
//       <Text tag="figcaption" lineHeight={23} mt="$2" color="$colorPress">
//         {children}
//       </Text>
//     </YStack>
//   ),

//   blockquote: ({ children, ...props }) => {
//     return (
//       <YStack my="$4" px="$6" ml="$3" borderLeftWidth={1} borderColor="$borderColor" jc="center" {...props}>
//         <Paragraph
//           fontFamily="$silkscreen"
//           whiteSpace="revert"
//           size="$8"
//           lh="$9"
//           fow="300"
//           ls="$0"
//           color="$color"
//           opacity={0.65}
//         >
//           {unwrapText(children)}
//         </Paragraph>
//       </YStack>
//     );
//   },

//   Preview: (props) => {
//     return <Preview {...props} mt="$5" />;
//   },

//   MediaPlayerDemo: ({ theme, ...props }) => {
//     return (
//       <Theme name={theme}>
//         <MediaPlayer {...props} />
//       </Theme>
//     );
//   },

//   GroupDisabledDemo: () => {
//     return (
//       <XGroup als="center" disabled>
//         <Button>First</Button>
//         <Button>Second</Button>
//         <Button>Third</Button>
//       </XGroup>
//     );
//   },

//   DemoButton: () => <Button>Hello world</Button>,

//   SponsorButton,

//   SponsorNotice: () => {
//     return (
//       <NoticeFrame theme="red">
//         <YStack maw="100%" space>
//           <H4 color="$color10" fontFamily="$silkscreen">
//             👋 Hey! Listen!
//           </H4>
//           <YStack ov="hidden" f={1} o={0.85} space>
//             <Paragraph>
//               Tamagui is fully OSS, self-funded and built by{' '}
//               <a href="https://twitter.com/natebirdman" target="_blank">
//                 me
//               </a>
//               .
//             </Paragraph>
//             <Paragraph>
//               My goal is to support Tamagui development with sponsorships that get early access to{' '}
//               <a href="#sponsors">some really interesting</a> new features.
//             </Paragraph>
//             <SponsorButton />
//           </YStack>
//         </YStack>
//       </NoticeFrame>
//     );
//   },
// };

// const LinkHeading = ({ id, children, ...props }: { id: string } & XStackProps) => (
//   <XStack tag="a" href={`#${id}`} id={id} data-id={id} display="inline-flex" ai="center" space {...props}>
//     {children}
//     <YStack tag="span" opacity={0.3}>
//       <Link size={12} color="var(--color)" aria-hidden />
//     </YStack>
//   </XStack>
// );

// const getNonTextChildren = (children) => {
//   return React.Children.map(children, (x) => {
//     if (typeof x === 'string') return null;
//     if (x['type'] === code) return null;
//     return x;
//   }).flat();
// };
