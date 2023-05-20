import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Button, Spacer, TooltipSimple, XStack, YStack } from 'tamagui';
import { CheckCircle, Clipboard, Paintbrush } from '@tamagui/lucide-icons';
import { Code } from '../Code';
import { ErrorBoundary } from '../ErrorBoundary';
import { LinearGradient } from 'tamagui/linear-gradient';
import { Pre } from '../Pre';
import { ScrollView } from 'react-native';
import { toggleTinted } from '../../utils/setTinted';
import { useClipboard } from '../../hooks/useClipboard';

export const DocCodeBlock = forwardRef((props: any, ref) => {
  const {
    className,
    children,
    id,
    isHero = false,
    isHighlightingLines,
    showLineNumbers: showLineNumbersIn,
    disableCopy,
    size,
    ...rest
  } = props;
  const lines = Array.isArray(children) ? children.length : 0;
  const isCollapsible = isHero || props.isCollapsible;
  const [isCollapsed, setIsCollapsed] = useState(isCollapsible);
  const isLong = lines > 22;
  const [isCutoff, setIsCutoff] = useState(isLong && !isCollapsible);
  const [code, setCode] = useState(undefined);
  const preRef = useRef<any>(null);
  const { hasCopied, onCopy } = useClipboard(code);
  const showLineNumbers = showLineNumbersIn ?? (lines > 10 ? true : false);

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
        {isCollapsible && (
          <XStack
            space="$2"
            position="absolute"
            display="inline-flex"
            alignItems="center"
            justifyContent="flex-end"
            top={-70}
            r="$6"
            $gtMd={{
              r: '$7',
            }}
          >
            <Button accessibilityLabel="Show or hide code" size="$2" onPress={() => setIsCollapsed((x) => !x)}>
              {isCollapsed ? 'Show code' : 'Hide code'}
            </Button>
            <TooltipSimple label="Toggle tint on/off">
              <Button accessibilityLabel="Toggle tint on/off" size="$2" onPress={toggleTinted} icon={Paintbrush} />
            </TooltipSimple>
          </XStack>
        )}
        {(!isCollapsed || !isCollapsible) && (
          <YStack
            position="relative"
            {...(isCutoff && {
              maxHeight: 400,
              ov: 'hidden',
              br: '$4',
            })}
          >
            {isCutoff && (
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
                  lineHeight={size ?? '$5'}
                  {...rest}
                >
                  {children}
                </Code>
              </ScrollView>
            </Pre>
            {!disableCopy && (
              <TooltipSimple label={hasCopied ? 'Copied' : 'Copy to clipboard'}>
                <Button
                  aria-label="Copy code to clipboard"
                  position="absolute"
                  size="$2"
                  top="$3"
                  right="$3"
                  display="inline-flex"
                  icon={hasCopied ? CheckCircle : Clipboard}
                  onPress={onCopy}
                  $xs={{
                    display: 'none',
                  }}
                />
              </TooltipSimple>
            )}
          </YStack>
        )}
      </ErrorBoundary>
    </YStack>
  );
});
