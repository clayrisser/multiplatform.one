import React from 'react';
import type { ReactNode } from 'react';
import { createWithLayout } from 'multiplatform.one';
import { withDebugLayout } from './Debug';

export interface DefaultLayoutProps {
  children: ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return <>{children}</>;
}

export const withDefaultLayout = createWithLayout(DefaultLayout, [withDebugLayout]);
