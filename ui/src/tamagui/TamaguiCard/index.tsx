import React from 'react';
import { H3, Paragraph, XStack } from 'tamagui';
import { Card } from '../Card';

export function TamaguiCard({ children, title, subTitle, ...props }) {
  return (
    <Card
      padding="$4"
      // mx="$1"
      // my="$2"
      marginBottom="$2"
      space="$2"
      $gtSm={{
        width: '50%',
        maxWidth: 'calc(50% - var(--space-8))',
      }}
      $sm={{ width: 'auto', maxWidth: 'auto', flex: 1 }}
    >
      <H3 tag="span" fontFamily="$silkscreen" size="$7" lh="$6" color="$color" cursor="inherit" ls={0}>
        {title}
      </H3>

      {!!subTitle && <XStack o={0.5}>{subTitle}</XStack>}

      <Paragraph tag="span" size="$4" cursor="inherit" theme="alt2" o={0.7}>
        {children}
      </Paragraph>
    </Card>
  );
}
