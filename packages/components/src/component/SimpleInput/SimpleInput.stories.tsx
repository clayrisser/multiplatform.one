import React from 'react';
import { SimpleInput } from '.';
import { YStack } from 'tamagui';
import { Key, Eye } from '@tamagui/lucide-icons';

export default {
  title: 'components/SimpleInput',
  component: SimpleInput,
  parameters: { status: { type: 'beta' } },
};

export const password = () => (
  <YStack justifyContent="center" alignItems="center">
    <SimpleInput password size="$3" iconAfter={Key} passwordWithoutIcon />
  </YStack>
);

export const iconBefore = () => <SimpleInput password width={800} height={50} iconBefore={Key} />;

export const iconAfter = () => (
  <SimpleInput width={250} height={50} iconAfter={Eye} placeholder="icon after input box" />
);

export const circular = () => <SimpleInput placeholder="icon after input box" circular password />;

export const passwordWithoutIcon = () => <SimpleInput password passwordWithoutIcon />;
