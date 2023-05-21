import React, { forwardRef, useEffect, useRef, useState } from 'react';
import type { CodeProps } from '../Code';
import type { ComponentProps } from 'react';
import { Button, Spacer, TooltipSimple, XStack, YStack, getTokens } from 'tamagui';
import { CheckCircle, Clipboard } from '@tamagui/lucide-icons';
import { Code } from '../Code';
import { ErrorBoundary } from '../../ErrorBoundary';
import { LinearGradient } from '@tamagui/linear-gradient';
import { Pre } from '../Pre';
import { ScrollView } from 'react-native';
import { useClipboard } from '../../hooks/useClipboard';

export const DocCodeBlock = forwardRef(
  (
    {
      className,
      children,
      id,
      isHero = false,
      isHighlightingLines,
      showLineNumbers: propShowLineNumbers,
      disableCopy,
      size,
      isCollapsible: propIsCollapsible,
      ...props
    }: CodeProps & {
      className?: string;
      disableCopy?: boolean;
      id?: string;
      isCollapsible?: boolean;
      isHero?: boolean;
      isHighlightingLines?: boolean;
      showLineNumbers?: boolean;
    },
    ref,
  ) => {
    const lines = Array.isArray(children) ? children.length : 0;
    const isCollapsible = isHero || propIsCollapsible;
    const [isCollapsed, setIsCollapsed] = useState(isCollapsible);
    const isLong = lines > 22;
    const [isCutoff, setIsCutoff] = useState(isLong && !isCollapsible);
    const [code, setCode] = useState(undefined);
    const preRef = useRef<any>(null);
    const { hasCopied, onCopy } = useClipboard(code);
    const showLineNumbers = propShowLineNumbers ?? (lines > 10 ? true : false);
    const tokens = getTokens();

    useEffect(() => {
      try {
        if (preRef.current) {
          const codeElement = preRef.current.querySelector('code');
          if (codeElement) {
            const code = codeElement.innerText.replace(/\n{3,}/g, '\n');
            setCode(code);
          }
        }
      } catch {}
    }, [preRef]);

    return (
      <YStack
        ref={ref}
        position="relative"
        mb="$4"
        {...(isHero && {
          px: '$4',
          mx: '$-4',
          $gtMd: {
            mx: '$-7',
          },
        })}
      >
        <ErrorBoundary>
          <YStack
            position="relative"
            {...(isCutoff && {
              maxHeight: 400,
              ov: 'hidden',
              br: '$4',
            })}
          >
            {(!isCollapsed || !isCollapsible) && isCutoff && (
              <LinearGradient
                pos="absolute"
                b={0}
                l={0}
                r={0}
                height={200}
                colors={['$backgroundTransparent', '$background']}
                zi={1000}
              >
                <Spacer f={1} />
                <Button onPress={() => setIsCutoff(!isCutoff)} als="center">
                  Show more
                </Button>
                <Spacer size="$4" />
              </LinearGradient>
            )}
            {(!isCollapsed || !isCollapsible) && (
              <Pre
                ref={preRef}
                data-invert-line-highlight={isHighlightingLines}
                data-line-numbers={showLineNumbers}
                className={className}
                p={0}
                mb={0}
                id={id}
              >
                <ScrollView
                  style={{ width: '100%' }}
                  contentContainerStyle={{ minWidth: '100%' }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  <Code
                    p="$4"
                    backgroundColor="transparent"
                    f={1}
                    className={className}
                    size={size ?? '$5'}
                    lineHeight={tokens.size[size || '$5']}
                    {...props}
                  >
                    {children}
                  </Code>
                </ScrollView>
              </Pre>
            )}
            <XStack position="absolute" top="$3" right="$3" space="$3">
              {(!isCollapsed || !isCollapsible) && !disableCopy && (
                <TooltipSimple label={hasCopied ? 'Copied' : 'Copy to clipboard'}>
                  <Button
                    aria-label="Copy code to clipboard"
                    size="$2"
                    icon={hasCopied ? CheckCircle : Clipboard}
                    onPress={onCopy}
                    $xs={{
                      display: 'none',
                    }}
                  />
                </TooltipSimple>
              )}
              {isCollapsible && (
                <Button accessibilityLabel="Show or hide code" size="$2" onPress={() => setIsCollapsed((x) => !x)}>
                  {isCollapsed ? 'Show code' : 'Hide code'}
                </Button>
              )}
            </XStack>
          </YStack>
        </ErrorBoundary>
      </YStack>
    );
  },
);

export type DocCodeBlockProps = ComponentProps<typeof DocCodeBlock>;
