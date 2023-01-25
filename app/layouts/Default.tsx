import React, { ComponentType, ReactNode } from 'react';
import { withDebugLayout } from './Debug';

export interface DefaultLayoutProps {
  children: ReactNode;
}

export function DefaultLayout({ children }) {
  return <>{children}</>;
}

export interface WithDefaultLayoutProps {}

export function withDefaultLayout<P extends WithDefaultLayoutProps = WithDefaultLayoutProps>(
  Component: ComponentType<P>,
) {
  return withDebugLayout((props: P) => (
    <DefaultLayout>
      <Component {...props} />
    </DefaultLayout>
  ));
}
