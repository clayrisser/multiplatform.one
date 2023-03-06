// import { AccessibleIcon } from '@tamagui/lucide-icons'
// import { AccessibleIcon } from '@tamagui/lucide-icons'
import React from 'react';
import { H3, H4, ListItem, Paragraph, Separator, XStack, YStack, styled } from 'tamagui';

import { Code } from '../Code';

export interface PropDef {
  name: string;
  required?: boolean;
  default?: string | boolean;
  type: string;
  description?: string;
}

export function PropsTable({
  title = 'Props',
  data,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: {
  title?: string;
  data: PropDef[];
  'aria-label'?: string;
  'aria-labelledby'?: string;
}) {
  const hasAriaLabel = !!(ariaLabel || ariaLabelledBy);
  return (
    <YStack
      borderWidth={1}
      borderColor="$borderColor"
      flex={1}
      aria-label={hasAriaLabel ? ariaLabel : 'Component Props'}
      aria-labelledby={ariaLabelledBy}
      marginVertical="$4"
      borderRadius="$4"
      overflow="hidden"
      marginHorizontal="$-4"
      $sm={{
        marginHorizontal: 0,
      }}
    >
      <XStack alignItems="center" paddingVertical="$2" paddingHorizontal="$4" backgroundColor="$borderColor">
        <H3 size="$3">{title}</H3>
      </XStack>
      {data.map(({ name, type, required, default: defaultValue, description }, i) => (
        <ListItem key={`${name}-${i}`} padding={0}>
          <YStack width="100%">
            <XStack position="relative" paddingVertical="$3" paddingHorizontal="$4" $sm={{ flexDirection: 'column' }}>
              <YStack fullscreen backgroundColor="$background" zIndex={-1} opacity={0.5} />
              <XStack minWidth="30%" alignItems="center" space>
                <H4 color="$color" fontWeight="800" fontFamily="$mono" textTransform="none" size="$4" width={200}>
                  {name}
                  {required ? (
                    <Paragraph tag="span" fontSize="inherit" opacity={0.5}>
                      {' '}
                      <Paragraph tag="span" fontWeight="300">
                        (required)
                      </Paragraph>
                    </Paragraph>
                  ) : null}
                </H4>
              </XStack>

              <Separator alignSelf="stretch" vertical marginHorizontal="$4" marginVertical="$2" />

              <XStack
                flex={2}
                minWidth="30%"
                alignItems="center"
                separator={<Separator alignSelf="stretch" vertical marginHorizontal="$4" marginVertical="$2" />}
                $xs={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <Paragraph size="$3" opacity={0.8} fontFamily="$mono" overflow="hidden" ellipse marginRight="auto">
                  {type}
                </Paragraph>

                <XStack alignItems="center">
                  {defaultValue ? (
                    <>
                      <Paragraph opacity={0.5} size="$2">
                        Default:&nbsp;
                      </Paragraph>
                      <Code marginVertical="$-1" backgroundColor="$backgroundPress">
                        {defaultValue}
                      </Code>
                    </>
                  ) : null}
                </XStack>
              </XStack>
            </XStack>

            {!!description && (
              <YStack paddingVertical="$2" paddingHorizontal="$4">
                <Paragraph size="$2" opacity={0.65}>
                  {description}
                </Paragraph>
              </YStack>
            )}
          </YStack>
          <Separator marginVertical={2} />
        </ListItem>
      ))}
    </YStack>
  );
}
