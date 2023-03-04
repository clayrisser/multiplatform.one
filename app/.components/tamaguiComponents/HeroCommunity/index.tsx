import React from 'react';
import { EnsureFlexed, YStack } from 'tamagui';

import { ContainerLarge } from '../Container';
import { SocialLinksRow } from '../SocialLinkRow';

export function Community() {
  return (
    <ContainerLarge marginTop="$3" marginBottom="$6" space="$6">
      <YStack maxWidth="100%" flexShrink={0} alignSelf="center">
        <EnsureFlexed />
        <SocialLinksRow />
      </YStack>
    </ContainerLarge>
  );
}
