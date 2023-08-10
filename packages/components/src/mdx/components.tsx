import React from 'react';
import type { Components } from '@mdx-js/react/lib';
import type { XStackProps } from 'tamagui';
import { CodeInline } from '../code/Code';
import { H1, H2, H3, H4, H5, H6, Paragraph, XStack, Text, YStack, styled } from 'tamagui';
import { HR } from './HR';
import { LI } from './LI';
import { Link as IconLink } from '@tamagui/lucide-icons';
import { Link } from 'solito/link';
import { MDXCodeBlock } from './MDXCodeBlock';
import { Platform } from 'react-native';
import { UL } from './UL';
import { unwrapText } from '../utils/unwrapText';

const code = ({ hero, line, scrollable, className, children, id, showLineNumbers, collapsible, ...props }) => {
  if (!className) return <CodeInline>{unwrapText(children)}</CodeInline>;
  return (
    <YStack marginTop="$3">
      <MDXCodeBlock
        className={className}
        isHighlightingLines={line !== undefined}
        showLineNumbers={showLineNumbers !== undefined}
        {...sanitizeProps(props)}
      >
        {children}
      </MDXCodeBlock>
    </YStack>
  );
};

export const TableHighlight = styled(YStack, {
  backgroundColor: '$yellow1',
  fullscreen: true,
});

export const mdxComponents: Components = {
  h1: (props) => <H1 marginBottom="$2" {...sanitizeProps(props)} />,
  h2: (props) => <H2 paddingTop="$8" marginTop="$-4" marginBottom="$2" data-heading {...sanitizeProps(props)} />,
  h3: ({ children, id, ...props }) => (
    <LinkHeading paddingTop="$8" marginTop="$-4" marginBottom="$1" id={id}>
      <H3 nativeID={id} {...sanitizeProps(props)}>
        {children}
      </H3>
      {getNonTextChildren(children)}
    </LinkHeading>
  ),
  h4: (props) => <H4 marginTop="$4" marginBottom="$3" {...sanitizeProps(props)} />,
  h5: (props) => <H5 marginTop="$4" {...sanitizeProps(props)} />,
  h6: (props) => <H6 marginTop="$4" {...sanitizeProps(props)} />,
  p: (props) => <Paragraph size="$6" marginVertical="$2.5" {...sanitizeProps(props)} />,
  a: ({ href = '', children, ...props }) => {
    return (
      <Link href={href}>
        {/* @ts-ignore */}
        <Paragraph fontSize="inherit" display="inline" cursor="pointer" {...sanitizeProps(props)}>
          {children}
          {/* {typeof href === 'string' && href.startsWith('http') ? (
            <>
              <Text>&nbsp;</Text>
              <Text fontSize="inherit" display="inline-flex" y={2} ml={-1}>
                <ExternalIcon />
              </Text>
            </>
          ) : null} */}
        </Paragraph>
      </Link>
    );
  },
  hr: (props) => <HR {...sanitizeProps(props)} />,
  ul: ({ children }) => (
    // @ts-ignore
    <UL marginVertical="$4">{React.Children.toArray(children).map((x) => (typeof x === 'string' ? null : x))}</UL>
  ),
  ol: (props) => <YStack {...sanitizeProps(props)} marginBottom="$3" />,
  li: (props) => (
    <LI size="$6" marginVertical="$1.5" className="docs-paragraph">
      {props.children}
    </LI>
  ),
  // @ts-ignore
  strong: (props) => <Paragraph fontSize="inherit" {...sanitizeProps(props)} fontWeight="700" />,
  img: ({ ...props }) => (
    <YStack marginVertical="$6">
      <YStack {...sanitizeProps(props)} maxWidth="100%" />
    </YStack>
  ),
  pre: ({ children }) => <>{children}</>,
  code,
  blockquote: ({ children, ...props }) => (
    <YStack
      borderColor="$borderColor"
      borderLeftWidth={1}
      justifyContent="center"
      marginLeft="$3"
      marginVertical="$4"
      paddingHorizontal="$6"
      {...sanitizeProps(props)}
    >
      <Paragraph
        color="$color"
        fontFamily="$silkscreen"
        fontWeight="300"
        lineHeight="$9"
        // @ts-ignore
        letterSpacing="$0"
        opacity={0.65}
        size="$8"
        whiteSpace="revert"
      >
        {unwrapText(children)}
      </Paragraph>
    </YStack>
  ),
  ...(Platform.OS === 'web'
    ? {}
    : {
        div: (props) => <Text {...sanitizeProps(props)} />,
        span: (props: any) => {
          let color: string | undefined;
          if (/^token punctuation/g.test(props?.className || '')) {
            color = '$red10';
          }
          return <Text color={color} {...sanitizeProps(props)} />;
        },
      }),
};

const LinkHeading = ({ id, children, ...props }: { id?: string } & XStackProps) => (
  <XStack
    href={`#${id}`}
    id={id}
    data-id={id}
    display="inline-flex"
    alignItems="center"
    space
    {...sanitizeProps(props)}
  >
    {children}
    <YStack opacity={0.3}>
      <IconLink size={12} color="var(--color)" aria-hidden />
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

function sanitizeProps<P>(props: any): P {
  if (Platform.OS !== 'web') return props;
  return props;
}
