import React from 'react';
import type { Components } from '@mdx-js/react/lib';
import type { XStackProps } from 'tamagui';
import { CodeInline } from '../code/Code';
import { DocCodeBlock } from '../code/DocCodeBlock';
import { ExternalIcon } from './ExternalIcon';
import { H1, H2, H3, H4, H5, H6, Paragraph, Text, XStack, YStack, styled } from 'tamagui';
import { HR } from './HR';
import { LI } from './LI';
import { Link as IconLink } from '@tamagui/lucide-icons';
import { Link } from 'solito/link';
import { Platform } from 'react-native';
import { UL } from './UL';
import { unwrapText } from '../utils/unwrapText';

const code = ({ hero, line, scrollable, className, children, id, showLineNumbers, collapsible, ...props }) => {
  if (!className) return <CodeInline>{unwrapText(children)}</CodeInline>;
  console.log('showLineNumbers', showLineNumbers);
  console.log('line', line);
  return (
    <YStack mt="$3">
      <DocCodeBlock
        className={className}
        isHighlightingLines={line !== undefined}
        showLineNumbers={showLineNumbers !== undefined}
        {...sanitizeProps(props)}
      >
        {children}
      </DocCodeBlock>
    </YStack>
  );
};

export const TableHighlight = styled(YStack, {
  bc: '$yellow1',
  fullscreen: true,
});

export const mdxComponents: Components = {
  h1: (props) => <H1 mb="$2" {...sanitizeProps(props)} />,
  h2: (props) => <H2 pt="$8" mt="$-4" mb="$2" data-heading {...sanitizeProps(props)} />,
  h3: ({ children, id, ...props }) => (
    <LinkHeading pt="$8" mt="$-4" mb="$1" id={id}>
      <H3 nativeID={id} {...sanitizeProps(props)}>
        {children}
      </H3>
      {getNonTextChildren(children)}
    </LinkHeading>
  ),
  h4: (props) => <H4 mt="$4" mb="$3" {...sanitizeProps(props)} />,
  h5: (props) => <H5 mt="$4" {...sanitizeProps(props)} />,
  h6: (props) => <H6 mt="$4" {...sanitizeProps(props)} />,
  p: (props) => <Paragraph size="$6" my="$2.5" {...sanitizeProps(props)} />,
  a: ({ href = '', children, ...props }) => {
    return (
      <Link href={href}>
        <Paragraph fontSize="inherit" display="inline" cursor="pointer" {...sanitizeProps(props)}>
          {children}
          {typeof href === 'string' && href.startsWith('http') ? (
            <>
              <Text>&nbsp;</Text>
              <Text fontSize="inherit" display="inline-flex" y={2} ml={-1}>
                <ExternalIcon />
              </Text>
            </>
          ) : null}
        </Paragraph>
      </Link>
    );
  },
  hr: (props) => <HR {...sanitizeProps(props)} />,
  ul: ({ children }) => (
    <UL my="$4">{React.Children.toArray(children).map((x) => (typeof x === 'string' ? null : x))}</UL>
  ),
  ol: (props) => <YStack {...sanitizeProps(props)} mb="$3" />,
  li: (props) => (
    <LI size="$6" my="$1.5" className="docs-paragraph">
      {props.children}
    </LI>
  ),
  strong: (props) => <Paragraph fontSize="inherit" {...sanitizeProps(props)} fontWeight="700" />,
  img: ({ ...props }) => (
    <YStack my="$6">
      <YStack {...sanitizeProps(props)} maxWidth="100%" />
    </YStack>
  ),
  pre: ({ children }) => <>{children}</>,
  code,
  blockquote: ({ children, ...props }) => (
    <YStack
      borderColor="$borderColor"
      borderLeftWidth={1}
      jc="center"
      ml="$3"
      my="$4"
      px="$6"
      {...sanitizeProps(props)}
    >
      <Paragraph
        color="$color"
        fontFamily="$silkscreen"
        fow="300"
        lh="$9"
        ls="$0"
        opacity={0.65}
        size="$8"
        whiteSpace="revert"
      >
        {unwrapText(children)}
      </Paragraph>
    </YStack>
  ),
};

const LinkHeading = ({ id, children, ...props }: { id?: string } & XStackProps) => (
  <XStack href={`#${id}`} id={id} data-id={id} display="inline-flex" ai="center" space {...sanitizeProps(props)}>
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
