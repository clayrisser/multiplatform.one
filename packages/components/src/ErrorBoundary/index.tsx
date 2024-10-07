import { Component } from "react";
import { Button, H2, YStack } from "tamagui";

const logger = console;

export class ErrorBoundary extends Component<any> {
  static getDerivedStateFromError(_err: Error) {
    return { hasError: true };
  }

  state = { hasError: false };

  componentDidCatch(err: Error, errorInfo: any) {
    logger.info({ error: err, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <YStack>
          <H2>Oops, there is an error!</H2>
          <Button onPress={() => this.setState({ hasError: false })}>
            Try again?
          </Button>
        </YStack>
      );
    }
    return this.props.children;
  }
}
