import type { UriProps } from 'react-native-svg';
import type { StackPropsBase } from 'tamagui';

const logger = console;

export type SvgUriProps = StackPropsBase & UriProps;

export function SvgUri(_props: SvgUriProps) {
  logger.error('use SimpleImage instead of SvgUri');
  return <>{}</>;
}
