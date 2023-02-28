import React from 'react';
import { createWithDebugLayout } from '@multiplatform.one/ui';

function DebugView() {
  return <>{}</>;
}

export const withDebugLayout = createWithDebugLayout([], { debugView: DebugView });
