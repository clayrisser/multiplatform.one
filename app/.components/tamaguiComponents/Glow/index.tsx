import { Circle, styled } from 'tamagui';

export const Glow = styled(Circle, {
  // contain: 'paint',
  className: 'glow',
  rotate: '20deg',
  backgroundColor: '$pink10',
  size: 620,
  scaleX: 0.8,
  scaleY: 1.75,
  y: 0,
  opacity: 0.1,
  pointerEvents: 'none',
});
