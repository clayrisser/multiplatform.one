import { ComponentType } from 'react';
import { Svg as RNSvg } from 'react-native-svg';
import { styled } from 'tamagui';

export const Svg = styled(RNSvg, {});

export type SvgProps = ComponentType<typeof Svg>;
