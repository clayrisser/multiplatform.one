import React from 'react';
import type { StackPropsBase } from 'tamagui';
import type { UriProps } from 'react-native-svg';

const logger = console;

export type SvgUriProps = StackPropsBase & UriProps;

export function SvgUri(_props: SvgUriProps) {
  logger.error('use SimpleImage instead of SvgUri');
  return <>{}</>;
}
