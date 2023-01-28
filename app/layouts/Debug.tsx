import React from 'react';
import { createWithDebugLayout } from '@multiplatform.one/ui';

function DebugView() {
  return <>{null}</>;
}

export const withDebugLayout = createWithDebugLayout([], { debugView: DebugView });
