import React from 'react';
import { H3, H4, ListItem, ScrollView, XStack, YStack } from 'tamagui';
// import { PropDef } from 'ui/src//tamagui/PropsTable';

export function DataTable({
  title = '',
  rows,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: {
  title?: string;
  rows: string[][];
  'aria-label'?: string;
  'aria-labelledby'?: string;
}) {
  const hasAriaLabel = !!(ariaLabel || ariaLabelledBy);
  return (
    <ScrollView horizontal>
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
        {!!title && (
          <XStack alignItems="center" paddingVertical="$2" paddingHorizontal="$4" backgroundColor="$borderColor">
            <H3 size="$3">{title}</H3>
          </XStack>
        )}

        {rows.map((items, i) => (
          <ListItem key={i} padding={0}>
            <XStack
              alignItems="center"
              position="relative"
              paddingVertical="$3"
              paddingHorizontal="$4"
              $sm={{ flexDirection: 'column' }}
            >
              {items.map((item) => (
                <H4
                  color="$color"
                  fontWeight="800"
                  key={item}
                  maxWidth={100}
                  fontFamily="$mono"
                  textTransform="none"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  numberOfLines={3}
                  size="$4"
                  width={200}
                >
                  {item}
                </H4>
              ))}
            </XStack>
          </ListItem>
        ))}
      </YStack>
    </ScrollView>
  );
}
