import React from 'react';
import { ErrorBoundary } from './index';
import { YStack, Text, Button } from 'tamagui';
export default {
  title: 'ui/tamagui/ErrorBoundary',
  component: ErrorBoundary,
  parameters: { status: { type: 'beta' } },
};

export const main = () => (
  <ErrorBoundary>
    <YStack>
      <Text>Oops, there is an error!</Text>
      <Button onPress={() => this.setState({ hasError: false })}>Try again?</Button>
    </YStack>
  </ErrorBoundary>
);
