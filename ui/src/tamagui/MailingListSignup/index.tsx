import type { Asset } from 'expo-asset';
import React from 'react';
import { memo } from 'react';
import { XStack, Input, Spacer, TooltipSimple, Button } from 'tamagui';
// import { useAssets } from 'ui/src/hooks';
// import { SponsorButton } from './index';
import { Mail } from '@tamagui/lucide-icons';

export const MailingListSignUp = memo(() => {
  //   return <SponsorButton />;

  return (
    <XStack
      borderWidth={1}
      borderColor="$borderColor"
      px="$7"
      pl="$6"
      height={48}
      ai="center"
      als="center"
      elevation="$2"
      bc="$background"
      br="$10"
    >
      <Input
        bc="transparent"
        borderWidth={0}
        w={200}
        placeholder="SignUp for the Newsletter"
        p={0}
        focusStyle={{
          borderWidth: 0,
        }}
      />
      <Spacer size="$6" />
      <TooltipSimple label="SignUp for occasional updates">
        <Button
          accessibilityLabel="SignUp to the Mailing List"
          size="$3"
          borderRadius="$8"
          mr="$-6"
          x={-1}
          icon={Mail}
          // onPress={onCopy}
        />
      </TooltipSimple>
    </XStack>
  );
});
