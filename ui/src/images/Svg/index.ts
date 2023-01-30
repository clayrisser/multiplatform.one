import type { Svg as RNSvg } from 'react-native-svg';
import { ComponentType } from 'react';
import { Svg as TSvg } from '@tamagui/react-native-svg';
import { styled } from 'tamagui';

export const Svg = styled(TSvg as typeof RNSvg, {});

export type SvgProps = ComponentType<typeof Svg>;
