import 'react-native';
import { MouseEvent } from 'react';

declare module 'react-native' {
  interface PressableStateCallbackType {
    hovered?: boolean;
    focused?: boolean;
  }
  interface ViewStyle {
    transitionProperty?: string;
    transitionDuration?: string;
  }
  interface TextProps {
    accessibilityComponentType?: never;
    accessibilityTraits?: never;
    href?: string;
    hrefAttrs?: {
      rel: 'noreferrer';
      target?: '_blank';
    };
  }
  interface ViewProps {
    accessibilityRole?: string;
    href?: string;
    hrefAttrs?: {
      rel: 'noreferrer';
      target?: '_blank';
    };
    onClick?: (e: MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  }
}
