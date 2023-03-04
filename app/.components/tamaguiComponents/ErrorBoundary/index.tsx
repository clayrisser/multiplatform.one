import React from 'react';
import { Component } from 'react';
import { YStack, Button, Text } from 'tamagui';

export class ErrorBoundary extends Component<any> {
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  state = { hasError: false };

  componentDidCatch(error, errorInfo) {
    console.log({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <YStack>
          <Text>Oops, there is an error!</Text>
          <Button onPress={() => this.setState({ hasError: false })}>Try again?</Button>
        </YStack>
      );
    }
    return this.props.children;
  }
}
