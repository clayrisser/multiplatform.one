import React from 'react';
import { SimpleInput } from '.';
import { YStack } from 'tamagui';
import { Key } from '@tamagui/lucide-icons';

export default {
  title: 'components/SimpleInput',
  component: SimpleInput,
  parameters: { status: { type: 'beta' } },
};

export const password = () => (
  <YStack justifyContent="center" alignItems="center">
    <SimpleInput password size="$3" />
  </YStack>
);

export const iconBefore = () => <SimpleInput password width={200} height={50} iconBefore={Key} />;

export const iconAfter = () => <SimpleInput width={200} height={50} iconAfter={Key} iconStyle={{ width: 90 }} />;
