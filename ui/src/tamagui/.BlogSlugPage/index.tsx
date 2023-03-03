import React from 'react';
import { Container } from '../Container';
import { components } from '@components/MDXComponents';
import { authors } from '@data/authors';
import { useTint } from 'ui/src/hooks/useTint';
import { ArrowLeft } from '@tamagui/lucide-icons';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import { Button, H1, H2, H3, H6, Paragraph, Separator, Spacer, Theme, XStack, YStack } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

import { Frontmatter } from '../frontmatter';
import { NextLink } from '../NextLink';

export type BlogPost = {
  frontmatter: Frontmatter;
  code: any;
  relatedPosts?: Frontmatter[];
  Component?: any;
};

function BlogArticleHeader({ frontmatter }: BlogPost) {
  const router = useRouter();
  const isDraft = router.pathname.startsWith('/draft');
  const { tint } = useTint();
  return (
    <Theme name={tint as any}>
      <YStack mt="$-10" pt="$10" mb="$4" pos="relative">
        <LinearGradient fullscreen colors={['$background', 'transparent']} />
        <Container>
          <YStack mt="$2" ai="flex-start">
            <NextLink href={isDraft ? '/draft' : '/blog'}>
              <Button size="$3" chromeless icon={ArrowLeft} ml="$-2" theme="alt1">
                {isDraft ? 'Drafts' : 'Blog'}
              </Button>
            </NextLink>
          </YStack>

          <H1 letterSpacing={-1} mt="$5" mb="$2">
            {frontmatter.title}
          </H1>

          <H2 o={0.5} theme="alt2" size="$7" fontWeight="500" fontFamily="$body" mb="$1">
            {frontmatter.description}
          </H2>

          <XStack ai="center" my="$3">
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

            <Separator vertical mx="$2" />

            <Paragraph o={0.4} tag="time" size="$3" theme="alt2" whiteSpace="nowrap">
              {format(parseISO(frontmatter.publishedAt || ''), 'MMMM yyyy')}
            </Paragraph>

            <Separator vertical mx="$2" />

            <YStack ai="center" display="none" $gtSm={{ display: 'flex' }}>
              <Paragraph o={0.4} size="$3" theme="alt2">
                {frontmatter.readingTime?.text}
              </Paragraph>

              {frontmatter.type === 'changelog' && (
                <>
                  <Separator vertical mx="$2" />
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
        <YStack tag="article" px="$2">
          <Component components={components as any} />
        </YStack>

        <Separator my="$8" mx="auto" />

        <YStack mb="$8" ai="center">
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
            <Separator my="$8" mx="auto" />
            <H3 mb="$3" ta="center" textTransform="uppercase">
              Related
            </H3>

            <YStack my="$4" space="$4">
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
