import React from 'react';
import { CheckCircle } from '../CheckCircle';
import { Paragraph, XStack, YStack } from 'tamagui';

export const Features = ({ items, size, ...props }: any) => {
  return (
    <YStack mt="$4" mb="$6" {...props} space="$4">
      {items.map((feature: any, i: number) => (
        <XStack tag="li" key={i}>
          <YStack mt={-5.5}>
            <CheckCircle />
          </YStack>
          <Paragraph size={size} color="$gray11">
            {feature}
          </Paragraph>
        </XStack>
      ))}
    </YStack>
  );
};
