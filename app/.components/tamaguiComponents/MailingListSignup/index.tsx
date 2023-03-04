// import type { Asset } from 'expo-asset';
import React from 'react';
import { memo } from 'react';
import { XStack, Input, Spacer, TooltipSimple, Button, YStack } from 'tamagui';
// import { SponsorButton } from '../SponsorButton';
import { Mail } from '@tamagui/lucide-icons';

export const MailingListSignUp = memo(() => {
  return (
    <XStack
      borderWidth={1}
      borderColor="$borderColor"
      paddingHorizontal="$7"
      paddingLeft="$6"
      height={48}
      alignItems="center"
      alignSelf="center"
      elevation="$2"
      backgroundColor="$background"
      borderRadius="$10"
    >
      <Input
        backgroundColor="transparent"
        borderWidth={0}
        width={200}
        placeholder="SignUp for the Newsletter"
        padding={0}
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
          marginRight="$-6"
          x={-1}
          icon={Mail}
          // onPress={onCopy}
        />
      </TooltipSimple>
    </XStack>
  );
});
