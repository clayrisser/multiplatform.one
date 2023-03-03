import React from 'react';
import { LinearGradient } from '@tamagui/linear-gradient';
import { NextLink } from '../NextLink';
import { ScrollView } from 'react-native';
import { EnsureFlexed, Paragraph, Theme, XStack, YStack } from 'tamagui';
import { Container } from '../Container';
import { DocsMenuContents } from '../DocsMenuContents';
import { Link } from '../Link';
import { useDocsMenu } from 'ui/src/hooks/useDocsMenu';
import { allDocsRoutes } from '@lib/docsRoutes';
import { ThemeTint, useTint } from 'ui/src/hooks/useTint';

export const allNotPending = allDocsRoutes.filter((x) => !x['pending']);

export function DocsPage({ children }: { children: React.ReactNode }) {
  const { currentPath, next, previous, documentVersionPath } = useDocsMenu();

  const GITHUB_URL = 'https://github.com';
  const REPO_NAME = 'tamagui/tamagui';
  const editUrl = `${GITHUB_URL}/${REPO_NAME}/edit/master/apps/site/data${currentPath}${documentVersionPath}.mdx`;

  const pageContents = React.useMemo(() => {
    return (
      <YStack>
        <YStack tag="article">
          <Container pos="relative">{children}</Container>

          <Container>
            {(previous || next) && (
              <XStack aria-label="Pagination navigation" my="$9" jc="space-between" space>
                {previous && (
                  <NextLink href={previous.route}>
                    <YStack
                      hoverStyle={{
                        borderColor: '$borderColorHover',
                      }}
                      flex={1}
                      width="50%"
                      p="$5"
                      borderRadius="$2"
                      borderWidth={1}
                      borderColor="$borderColor"
                      pressStyle={{
                        backgroundColor: '$backgroundPress',
                      }}
                      aria-label={`Previous page: ${previous.title}`}
                      ai="flex-start"
                    >
                      <Paragraph userSelect="none" theme="alt1" size="$5">
                        Previous
                      </Paragraph>
                      <Paragraph userSelect="none" size="$3" color="$gray10">
                        {previous.title}
                      </Paragraph// import { allDocsRoutes } from '@lib/docsRoutes';
// import { LinearGradient } from '@tamagui/linear-gradient';
// import { ThemeTint, useTint } from '@tamagui/tint';
// // import { NextLink } from 'ui/'
// import {NextLink} from 'ui/src/tamagui/NextLink'
// import * as React from 'react';
// import { ScrollView } from 'react-native';
// import { EnsureFlexed, Paragraph, Theme, XStack, YStack } from 'tamagui';
// import { Container } from './Container';
// import { DocsMenuContents } from './DocsMenuContents';
// import { Link } from './Link';
// import { useDocsMenu } from './useDocsMenu';>
                    </YStack>
                  </NextLink>
                )}
                {next && (
                  <NextLink href={next.route} passHref>
                    <YStack
                      hoverStyle={{
                        borderColor: '$borderColorHover',
                      }}
                      width="50%"
                      flex={1}
                      p="$5"
                      borderRadius="$2"
                      borderWidth={1}
                      borderColor="$borderColor"
                      pressStyle={{
                        backgroundColor: '$backgroundPress',
                      }}
                      aria-label={`Previous page: ${next.title}`}
                      ai="flex-end"
                    >
                      <Paragraph userSelect="none" theme="alt1" size="$5">
                        Next
                      </Paragraph>
                      <Paragraph userSelect="none" size="$3" color="$gray10">
                        {next.title}
                      </Paragraph>
                    </YStack>
                  </NextLink>
                )}
              </XStack>
            )}
          </Container>

          <Container my="$3">
            <Link
              href={editUrl}
              // @ts-ignore
              title="Edit this page on GitHub."
              rel="noopener noreferrer"
              target="_blank"
            >
              Edit this page on GitHub.
            </Link>
          </Container>
        </YStack>
      </YStack>
    );
  }, [children, previous, next, editUrl]);

  return (
    <>
      <YStack
        overflow="hidden"
        marginHorizontal="auto"
        $gtSm={{
          flexDirection: 'row',
        }}
        maxWidth={1250}
        zIndex={100}
        position="relative"
      >
        <EnsureFlexed />
        <YStack
          overflow="hidden"
          $md={{
            display: 'none',
          }}
          // className="custom-scroll"
          $gtSm={{
            position: 'fixed' as any,
            top: 0,
            left: 'calc(min(100vw, 1250px))px',
            bottom: 0,
            width: 230,
          }}
        >
          <LinearGradient
            position="absolute"
            top={0}
            left={0}
            right={0}
            height={100}
            width={300}
            zIndex={100}
            colors={['$backgroundStrong', '$backgroundStrong', '$backgroundTransparent']}
          />
          <ScrollView>
            <ThemeTint>
              <YStack
                display="none"
                $gtMd={{
                  display: 'block',
                  paddingRight: '$6',
                  marginTop: 108,
                  paddingBottom: '$18',
                }}
              >
                <DocsMenuContents />
              </YStack>
            </ThemeTint>
          </ScrollView>
        </YStack>
      </YStack>

      <YStack
        maxWidth="100%"
        flex={1}
        paddingVertical="$8"
        $gtMd={{
          paddingBottom: '$9',
          paddingLeft: 230,
          paddingRight: 100,
        }}
      >
        {pageContents}
      </YStack>
    </>
  );
}

// export interface NavItemProps = {
//   children: React.ReactNode;
//   active?: boolean;
//   href: string;
//   pending?: boolean;
//   external?: boolean;
// };
