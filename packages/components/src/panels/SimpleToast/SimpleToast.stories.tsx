import { SimpleToast } from './index';
import React from 'react';
import { useToastController } from '@tamagui/toast';
import { YStack, Button } from 'tamagui';

export default {
  title: 'panels/SimpleToast',
  component: SimpleToast,
  parameters: {
    status: {
      type: 'code',
    },
  },
};

const Main = () => {
  const toastState = useToastController();

  return (
    <YStack>
      <SimpleToast />
      <Button onPress={() => toastState.show(JSON.stringify({ title: 'Hello', message: 'World' }))}>Add Toast</Button>
    </YStack>
  );
};

export const Default = () => <Main />;
