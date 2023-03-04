import React from 'react';
import { Container } from '../Container';
import { components } from '../MDXComponents';
// import { authors } from '@data/authors';
import { useTint } from '../../hooks/useTint';
import { ArrowLeft } from '@tamagui/lucide-icons';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import { Button, H1, H2, H3, H6, Paragraph, Separator, Spacer, Theme, XStack, YStack } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';
<<<<<<< HEAD:ui/src/tamagui/.BlogSlugPage/index.tsx

import { FrontMatterContext } from '../FrontMatterContext';
=======
import { Frontatter } from '../FrontmatterContext';
>>>>>>> 3b90c2d0c68124f141f513124eb2fc14f9eb3da1:app/.components/.BlogSlugPage/index.tsx
import { NextLink } from '../NextLink';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BlogPost = {
  frontmatter: Frontager;
  code: any;
  relatedPosts?: Frontager[];
  Component?: any;
};

function BlogArticleHeader({ frontmatter }: BlogPost) {
  const router = useRouter();
  const isDraft = router.pathname.startsWith('/draft');
  const { tint } = useTint();
  return (
    <Theme name={tint as any}>
      <YStack marginTop="$-10" paddingTop="$10" marginBottom="$4" position="relative">
        <LinearGradient fullscreen colors={['$background', 'transparent']} />
        <Container>
          <YStack marginTop="$2" alignItems="flex-start">
            <NextLink href={isDraft ? '/draft' : '/blog'}>
              <Button size="$3" chromeless icon={ArrowLeft} marginLeft="$-2" theme="alt1">
                {isDraft ? 'Drafts' : 'Blog'}
              </Button>
            </NextLink>
          </YStack>

          <H1 letterSpacing={-1} marginTop="$5" marginBottom="$2">
            {frontmatter.title}
          </H1>

          <H2 opacity={0.5} theme="alt2" size="$7" fontWeight="500" fontFamily="$body" marginBottom="$1">
            {frontmatter.description}
          </H2>

          <XStack alignItems="center" marginVertical="$3">
            {/* <Avatar src={authors[data.by].avatar} mr={2} /> */}

            <Paragraph size="$3" theme="alt2" whiteSpace="nowrap">
              <NextLink
                href={`https://twitter.com/${authors?.[frontmatter.by || '']?.twitter}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {authors?.[frontmatter.by || '']?.name}
              </NextLink>
            </Paragraph>

            <Separator vertical marginHorizontal="$2" />

            <Paragraph opacity={0.4} tag="time" size="$3" theme="alt2" whiteSpace="nowrap">
              {format(parseISO(frontmatter.publishedAt || ''), 'MMMM yyyy')}
            </Paragraph>

            <Separator vertical marginHorizontal="$2" />

            <YStack alignItems="center" display="none" $gtSm={{ display: 'flex' }}>
              <Paragraph opacity={0.4} size="$3" theme="alt2">
                {frontmatter.readingTime?.text}
              </Paragraph>

              {frontmatter.type === 'changelog' && (
                <>
                  <Separator vertical marginHorizontal="$2" />
                  <Button>Changelog</Button>
                </>
              )}
            </YStack>
          </XStack>
        </Container>

        <Spacer />

        <Separator />
      </YStack>
    </Theme>
  );
}

export function BlogSlugPage(props: BlogPost) {
  const { frontmatter, relatedPosts, Component } = props;
  const enc = encodeURIComponent;
  const authorTwitter = authors?.[frontmatter.by || '']?.twitter;
  const tweetText = `${frontmatter.title} by @${authorTwitter} on the @tamagui_js blog.`;
  const tweetUrl = `https://tamagui.dev/blog/${frontmatter.slug}`;
  const twitterShare = `https://twitter.com/intent/tweet?text="${enc(tweetText)}"&url=${enc(tweetUrl)}`;

  return (
    <>
      <BlogArticleHeader {...props} />

      <Container>
        <YStack tag="article" paddingHorizontal="$2">
          <Component components={components as any} />
        </YStack>

        <Separator marginVertical="$8" marginHorizontal="auto" />

        <YStack marginBottom="$8" alignItems="center">
          <Paragraph>
            Share this post on{' '}
            <NextLink href={twitterShare} target="_blank" rel="noopener noreferrer" title="Share this post on Twitter">
              Twitter
            </NextLink>
            .
          </Paragraph>
        </YStack>

        {relatedPosts && (
          <YStack>
            <Separator marginVertical="$8" marginHorizontal="auto" />
            <H3 marginBottom="$3" textAlign="center" textTransform="uppercase">
              Related
            </H3>

            <YStack marginVertical="$4" space="$4">
              {relatedPosts.map((frontmatter) => {
                return (
                  <Paragraph tag="a" key={frontmatter.slug} href={`/blog/${frontmatter.slug}`}>
                    <YStack space="$2">
                      <H6>{frontmatter.title}</H6>
                      <Paragraph>{frontmatter.description}</Paragraph>
                    </YStack>
                  </Paragraph>
                );
              })}
            </YStack>
          </YStack>
        )}
      </Container>
    </>
  );
}
