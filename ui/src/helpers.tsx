import React, { ReactNode } from 'react';
import { Text } from 'tamagui';

const isPerformanceNow = typeof performance !== 'undefined' && performance.now;
const date = isPerformanceNow ? performance : Date;
let _previousUnique: number;

export function fastUnique() {
  let unique = date.now();
  while (unique === _previousUnique) {
    unique = date.now();
  }
  _previousUnique = unique;
  if (isPerformanceNow) return Date.now() + unique.toString();
  return unique.toString();
}

export function isText(children: unknown) {
  if (Array.isArray(children)) {
    return (
      children.length > 1 &&
      typeof children[0] === 'string' &&
      '_owner' in children[1] &&
      '_store' in children[1] &&
      'key' in children[1] &&
      'props' in children[1] &&
      'ref' in children[1] &&
      'type' in children[1]
    );
  }
  return typeof children === 'string';
}

export function useWrapTextChildren(children: any, props?: any): ReactNode {
  if (isText(children)) {
    return <Text {...props}>{children?.toString()}</Text>;
  }
  return children;
}
