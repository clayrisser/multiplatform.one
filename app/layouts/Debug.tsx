import React from 'react';
import { createWithDebugLayout } from 'ui';

function DebugView() {
  return <>{null}</>;
}

export const withDebugLayout = createWithDebugLayout([], { debugView: DebugView });
