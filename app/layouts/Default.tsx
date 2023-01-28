import React, { ReactNode } from 'react';
import { createWithLayout } from '@multiplatform.one/ui';
import { withDebugLayout } from './Debug';

export interface DefaultLayoutProps {
  children: ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return <>{children}</>;
}

export const withDefaultLayout = createWithLayout(DefaultLayout, [withDebugLayout]);
