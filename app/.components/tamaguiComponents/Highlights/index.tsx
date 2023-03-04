import { ExternalLink } from '@tamagui/lucide-icons';
import React from 'react';
import { H2, Paragraph, Separator, SizableText, Text, VisuallyHidden, XStack, YStack } from 'tamagui';

import { Features } from '../Features';
import { FrontmatterContext } from '../FrontMatterContext';
import { Link } from '../Link';

export function Highlights({ features, disableLinks }: any) {
  const frontmatter = React.useContext(FrontmatterContext);

  return (
    <YStack
      marginVertical="$2"
      flex={1}
      $gtSm={{
        flexDirection: 'row',
      }}
    >
      <YStack
        flex={1}
        minHeight={142}
        $gtSm={{
          flex: 1,
          marginRight: '$5',
        }}
      >
        <H2 fontFamily="$body" size="$6" marginBottom="$2" fontWeight="800">
          Features
        </H2>

        <YStack tag="ul" padding={0} margin={0} space>
          <Features space="$2" items={features} />
        </YStack>
      </YStack>

      {!disableLinks && (
        <YStack space="$3" tag="nav" aria-labelledby="site-component-info-header">
          <VisuallyHidden>
            <h2 id="site-component-info-heading">Component Reference Links</h2>
          </VisuallyHidden>

          <Separator />

          <YStack marginBottom="$4" space="$1">
            <Link
              href={`https://github.com/tamagui/tamagui/tree/master/packages/${
                frontmatter.package
                  ? `${frontmatter.package}/src/${frontmatter.component}.tsx`
                  : `tamagui/src/views/${frontmatter.component}.tsx`
              }`}
              target="_blank"
            >
              <XStack alignItems="center" space="$1">
                <SizableText size="$2">View source</SizableText>
                <YStack opacity={0.5} marginLeft="$0.5">
                  <ExternalLink size={12} color="var(--colorHover)" />
                </YStack>
              </XStack>
            </Link>
            <Link href="https://www.npmjs.com/package/tamagui" target="_blank">
              <XStack alignItems="center" space="$1">
                <SizableText size="$2">View on npm</SizableText>
                <YStack opacity={0.5} marginLeft="$0.5">
                  <ExternalLink size={12} color="var(--colorHover)" />
                </YStack>
              </XStack>
            </Link>
            <Link href="https://github.com/tamagui/tamagui/issues/new/choose" target="_blank">
              <XStack alignItems="center" space="$1">
                <SizableText size="$2">Report an issue</SizableText>
                <YStack opacity={0.5} marginLeft="$0.5">
                  <ExternalLink size={12} color="var(--colorHover)" />
                </YStack>
              </XStack>
            </Link>

            {/* @ts-ignore */}
            {frontmatter.aria && (
              <YStack marginBottom="$2">
                {/* @ts-ignore */}
                <Link theme="blue" href={frontmatter.aria} target="_blank">
                  <XStack position="relative">
                    <Paragraph size="$2" theme="alt1">
                      ARIA design pattern
                    </Paragraph>
                    <YStack marginLeft="$1">
                      <Text theme="alt2">
                        <ExternalLink size={12} color="var(--color)" />
                      </Text>
                    </YStack>
                  </XStack>
                </Link>
              </YStack>
            )}
          </YStack>
        </YStack>
      )}
    </YStack>
  );
}
