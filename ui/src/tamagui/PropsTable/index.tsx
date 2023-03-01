// import { AccessibleIcon } from '@tamagui/lucide-icons'
// import { AccessibleIcon } from '@tamagui/lucide-icons'
import React from 'react';
import { H3, H4, ListItem, Paragraph, Separator, XStack, YStack, styled } from 'tamagui';
import { Code } from './Code';

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
      f={1}
      aria-label={hasAriaLabel ? ariaLabel : 'Component Props'}
      aria-labelledby={ariaLabelledBy}
      my="$4"
      br="$4"
      ov="hidden"
      mx="$-4"
      $sm={{
        mx: 0,
      }}
    >
      <XStack ai="center" py="$2" px="$4" backgroundColor="$borderColor">
        <H3 size="$3">{title}</H3>
      </XStack>
      {data.map(({ name, type, required, default: defaultValue, description }, i) => (
        <ListItem key={`${name}-${i}`} p={0}>
          <YStack width="100%">
            <XStack pos="relative" py="$3" px="$4" $sm={{ flexDirection: 'column' }}>
              <YStack fullscreen backgroundColor="$background" zi={-1} o={0.5} />
              <XStack miw="30%" ai="center" space>
                <H4 color="$color" fow="800" fontFamily="$mono" textTransform="none" size="$4" width={200}>
                  {name}
                  {required ? (
                    <Paragraph tag="span" fontSize="inherit" o={0.5}>
                      {' '}
                      make[2]: *** [Makefile:48:
                      /home/lavanya/projects/risserlabs/community/ui/ui/.mkpm/.tmp/mkchain/done/build] Error 1 make[1]:
                      *** [Makefile:59: ui/build] Error 2 make: *** [Makefile:16:
                      /home/lavanya/projects/risserlabs/community/ui/.mkpm/.tmp/mkchain/done/install] Error 2 make: ***
                      Deleting file '/home/lavanya/projects/risserlabs/community/ui/.mkpm/.tmp/mkchain/done/install'
                      <Paragraph tag="span" fontWeight="300">
                        (required)
                      </Paragraph>
                    </Paragraph>
                  ) : null}
                </H4>
              </XStack>

              <Separator als="stretch" vertical mx="$4" my="$2" />

              <XStack
                f={2}
                miw="30%"
                ai="center"
                separator={<Separator als="stretch" vertical mx="$4" my="$2" />}
                $xs={{
                  flexDirection: 'column',
                  ai: 'flex-start',
                }}
              >
                <Paragraph size="$3" o={0.8} fontFamily="$mono" overflow="hidden" ellipse mr="auto">
                  {type}
                </Paragraph>

                <XStack ai="center">
                  {Boolean(defaultValue) ? (
                    <>
                      <Paragraph o={0.5} size="$2">
                        Default:&nbsp;
                      </Paragraph>
                      <Code my="$-1" bc="$backgroundPress">
                        {defaultValue}
                      </Code>
                    </>
                  ) : null}
                </XStack>
              </XStack>
            </XStack>

            {!!description && (
              <YStack py="$2" px="$4">
                <Paragraph size="$2" o={0.65}>
                  {description}
                </Paragraph>
              </YStack>
            )}
          </YStack>
          <Separator my={2} />
        </ListItem>
      ))}
    </YStack>
  );
}
