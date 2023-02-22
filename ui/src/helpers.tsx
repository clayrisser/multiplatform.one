import type { ReactNode, ComponentType } from 'react';
import React from 'react';
import { Text } from 'tamagui';
import { isText } from 'multiplatform.one';

export function useAutoText(children: any, Component: ComponentType<any> = Text, props?: any): ReactNode {
  if (isText(children)) {
    return <Component {...props}>{children?.toString()}</Component>;
  }
  return children;
}
