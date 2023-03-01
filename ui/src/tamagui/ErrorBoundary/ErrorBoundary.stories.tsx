import React from 'react';
import { ErrorBoundary } from './index';

export default {
  title: 'ui/tamagui/ErrorBoundary',
  component: ErrorBoundary,
  parameters: { status: { type: 'beta' } },
};

export const main = () => <ErrorBoundary />;
