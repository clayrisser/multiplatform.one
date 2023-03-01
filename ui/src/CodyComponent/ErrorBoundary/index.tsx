import { Component } from 'react';

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
        <div>
          <h2>Oops, there is an error!</h2>
          <button type="button" onClick={() => this.setState({ hasError: false })}>
            Try again?
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
